class AdminMailer < ApplicationMailer

  def new_registration_info(registration)
    @user_name = registration.full_name
    @url = edit_admin_user_registration_url(id: registration.id, locale: 'de')

    mail(
      subject: "new registration for #{Project.project_shortname}",
      from: "no-reply@cedis.fu-berlin.de",
      recipients: "#{Project.contact_email}",
      date:         Time.now
    )
  end

  def finished_job
    @receiver = params[:receiver]
    @type = params[:type]
    @file = params[:file]
    mail(subject: 'finished job',to: @receiver.email)
  end

end
