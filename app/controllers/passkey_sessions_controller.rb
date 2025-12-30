class PasskeySessionsController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :check_ohd_session
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  
  # Step 1: Generate authentication challenge
  def challenge
    email = params[:email]
    user = User.find_by(email: email)
    
    if user && user.webauthn_credentials.any?
      options = WebAuthn::Credential.options_for_get(
        allow: [] #user.webauthn_credentials.pluck(:external_id)
      )
      
      session[:authentication_challenge] = options.challenge
      session[:passkey_user_id] = user.id
      
      render json: options
    else
      render json: { error: "No passkeys found" }, status: :not_found
    end
  end

  def verify
    # Accept nested credential parameter
    credential_with_strings = params.require(:credential).permit(
      :type,
      :id,
      :rawId,
      :authenticatorAttachment,
      clientExtensionResults: {},
      response: [:clientDataJSON, :authenticatorData, :signature, :userHandle]
    ).to_h
    
    webauthn_credential = WebAuthn::Credential.from_get(credential_with_strings)
    user = User.find(session[:passkey_user_id])

    db_credential = user.webauthn_credentials.find_by(external_id: webauthn_credential.id)

    begin
      webauthn_credential. verify(
        session[:authentication_challenge],
        public_key:  db_credential.public_key,
        sign_count: db_credential.sign_count
      )

      db_credential.update!(sign_count: webauthn_credential.sign_count)
      sign_in(:user, user)
      #after_sign_in(resource)

      render json: { success: true, redirect_url: after_sign_in_path_for(user) }
    rescue WebAuthn::SignCountVerificationError => e
      render json: { error: "Invalid passkey" }, status: :unprocessable_entity
    ensure
      session.delete(:authentication_challenge)
      session.delete(:passkey_user_id)
    end
  end
end
