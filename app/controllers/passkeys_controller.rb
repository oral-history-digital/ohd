class PasskeysController < ApplicationController
  before_action :authenticate_user!
  
  # Initialize passkey registration
  def new
    authorize current_user, :manage_passkeys?

    rp_id = get_rp_id(request)

    options = WebAuthn::Credential.options_for_create(
      user: {
        id: current_user.webauthn_id,
        name: current_user.email,
        display_name: current_user.email
      },
      authenticator_selection: {
        user_verification: "required",
        require_resident_key: false,
        resident_key: "preferred",
        authenticator_attachment: "platform"  # This requests platform authenticator (Touch ID, Windows Hello, etc.)
      },
      exclude: current_user.webauthn_credentials.pluck(:external_id),
      rp: {
        name: "OHD",
        id: rp_id
      }
    )
    
    session[:creation_challenge] = options.challenge
    
    render json: options.as_json
  end
  
  # Complete passkey registration
  def create
    authorize current_user, :manage_passkeys?
    webauthn_credential = WebAuthn::Credential.from_create(params[:credential])
    
    begin
      webauthn_credential.verify(session[:creation_challenge])
      
      current_user.webauthn_credentials.create!(
        nickname: params[:nickname] || "Passkey #{current_user.webauthn_credentials.count + 1}",
        external_id: webauthn_credential.id,
        public_key: webauthn_credential.public_key,
        sign_count: webauthn_credential.sign_count
      )
      
      render json: { success: true }
    rescue WebAuthn::Error => e
      render json: { error: e.message }, status: :unprocessable_entity
    ensure
      session.delete(:creation_challenge)
    end
  end
  
  def index
    @webauthn_credentials = current_user.webauthn_credentials
  end

  def destroy
    credential = current_user.webauthn_credentials.find(params[:id])
    credential.destroy
    redirect_to settings_path, notice: "Passkey removed successfully"
  end

  private

  def get_rp_id(request)
    uri = URI.parse(request.base_url)
    uri.host
    #request.host.include?('localhost') ? 'localhost' : request.host.split(':').first
  end
end
