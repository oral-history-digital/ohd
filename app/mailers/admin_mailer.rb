class AdminMailer < ApplicationMailer

  def new_registration_info 
    registration = params[:registration]
    @project = params[:project]
    @user_name = registration.full_name
    uri = URI.parse(@project.archive_domain)
    @url = user_registrations_url(protocol: uri.scheme, host: uri.host, project_id: @project.identifier, locale: @project.available_locales.first)

    mail(
      subject: "new registration for #{@project.shortname}",
      from: "no-reply@cedis.fu-berlin.de",
      to: @project.contact_email,
      date: Time.now
    )
  end

  def finished_job
    @receiver = params[:receiver]
    @type = params[:type]
    @interview = params[:interview]
    @file = params[:file]
    mail(
      subject: 'finished job',
      from: "no-reply@cedis.fu-berlin.de",
      to: @receiver.email,
      date: Time.now
    )
  end

end
