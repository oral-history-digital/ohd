class AdminMailer < ApplicationMailer

  def new_registration_info 
    registration = params[:registration]
    @project = params[:project]
    @user_name = registration.full_name
    @url = user_registrations_url(project_id: @project.identifier, locale: 'de')

    mail(
      subject: "new registration for #{@project.shortname}",
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
