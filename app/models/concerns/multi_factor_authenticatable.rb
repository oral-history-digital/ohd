module MultiFactorAuthenticatable
  extend ActiveSupport::Concern

  EMAIL_OTP_VALID_FOR = 10.minutes
  EMAIL_OTP_LENGTH = 6
  OTP_ALLOWED_DRIFT = 30

  included do
    encrypts :otp_secret, deterministic: true
    before_save :generate_two_factor_secret_if_needed
    before_save :update_passkey_required_timestamp
  end

  module ClassMethods
    def generate_otp_secret(otp_secret_length = 6)
      ROTP::Base32.random(otp_secret_length)
    end
  end

  def generate_two_factor_secret_if_needed
    if (self.otp_required_for_login_changed? || self.confirmed_at_changed?)
      if self.otp_required_for_login && self.otp_secret.blank?
        self.otp_secret = User.generate_otp_secret
        self.changed_to_otp_at = Time.now
      elsif !self.otp_required_for_login
        self.otp_secret = nil
        self.changed_to_otp_at = nil
      end
    end
  end

  def update_passkey_required_timestamp
    if (self.passkey_required_for_login_changed? || self.confirmed_at_changed?)
      if self.passkey_required_for_login
        self.changed_to_passkey_at = Time.now
      else
        self.changed_to_passkey_at = nil
      end
    end
  end

  def otp_provisioning_uri(account, options = {})
    otp_secret = options[:otp_secret] || self.otp_secret
    ROTP::TOTP.new(otp_secret, options).provisioning_uri(account)
  end

  # This defaults to the model's otp_secret                                                                                                                           
  # If this hasn't been generated yet, pass a secret as an option                                                                                                     
  def validate_and_consume_otp!(code, options = {})                                                                                                                   
    otp_secret = options[:otp_secret] || self.otp_secret                                                                                                              
    return false unless code.present? && otp_secret.present?                                                                                                          

    totp = otp(otp_secret)

    if self.consumed_timestep
      # reconstruct the timestamp of the last consumed timestep
      after_timestamp = self.consumed_timestep * totp.interval
    end

    if totp.verify(code.gsub(/\s+/, ""),
      drift_behind: OTP_ALLOWED_DRIFT,
      drift_ahead: OTP_ALLOWED_DRIFT, 
      after: OTP_ALLOWED_DRIFT 
    )
      return consume_otp!
    end

    false
  end

  def otp(otp_secret = self.otp_secret)
    ROTP::TOTP.new(otp_secret)
  end

  def current_otp
    otp.at(Time.now)
  end

  # ROTP's TOTP#timecode is private, so we duplicate it here
  def current_otp_timestep
    Time.now.utc.to_i / otp.interval
  end

  def send_new_otp_code
    email_otp = generate_email_otp!
    CustomDeviseMailer.two_factor_authentication_code(self, email_otp).deliver_later
  end

  def generate_email_otp! 
    # Generate 6-digit numeric code
    otp = SecureRandom.random_number(10**EMAIL_OTP_LENGTH).to_s.rjust(EMAIL_OTP_LENGTH, '0')
    
    # Store encrypted version
    self.email_otp_secret = BCrypt::Password.create(otp)
    self.email_otp_sent_at = Time. current
    save!
    
    # Return plain text code (only time it's visible)
    otp
  end

  def verify_email_otp(code)
    return false if email_otp_secret.blank?  || email_otp_sent_at.blank?
    
    # Check if OTP is expired
    return false if Time.current > email_otp_sent_at + EMAIL_OTP_VALID_FOR
    
    # Verify the code
    BCrypt::Password.new(email_otp_secret) == code
  end

  def clear_email_otp! 
    update(email_otp_secret: nil, email_otp_sent_at: nil)
  end

  def email_otp_expired?
    return true if email_otp_sent_at.blank?
    Time.current > email_otp_sent_at + EMAIL_OTP_VALID_FOR
  end

  def email_otp_time_remaining
    return 0 if email_otp_sent_at.blank?
    remaining = (email_otp_sent_at + EMAIL_OTP_VALID_FOR - Time.current).to_i
    [remaining, 0].max
  end

  protected

  # An OTP cannot be used more than once in a given timestep
  # Storing timestep of last valid OTP is sufficient to satisfy this requirement
  def consume_otp!
    if self.consumed_timestep != current_otp_timestep
      self.consumed_timestep = current_otp_timestep
      save!(validate: false)
      return true
    end

    false
  end

end

