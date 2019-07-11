class AdminMailer < ApplicationMailer

  def new_registration_info
    registration = params[:registration]
    @user_name = registration.full_name
    @url = user_registrations_url(locale: 'de')

    mail(
      subject: "new registration for #{Project.project_shortname}",
      from: "no-reply@cedis.fu-berlin.de",
      to: Project.contact_email,
      date: Time.now
    )
  end

  def finished_job
    @receiver = params[:receiver]
    @type = params[:type]
    @file = params[:file]
    mail(subject: 'finished job',to: @receiver.email)
  end

end
