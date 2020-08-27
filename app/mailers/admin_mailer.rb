class AdminMailer < ApplicationMailer

  def new_registration_info
    registration = params[:registration]
    @project = params[:project]
    @user_name = registration.full_name
    uri = URI.parse(@project.archive_domain)
    @url = user_registrations_url(protocol: uri.scheme, host: uri.host, locale: @project.available_locales.first)

    mail(
      subject: "Neue Registrierung zur Prüfung",
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

  def new_comment
    @author = params[:author]
    @receiver = params[:receiver]
    @task = params[:task]
    @text = params[:text]
    mail(
      subject: 'Neuer Kommentar',
      from: "no-reply@cedis.fu-berlin.de",
      to: @receiver.email,
      date: Time.now
    )
  end

  def task_assigned
    @receiver = params[:receiver]
    @task = params[:task]
    mail(
      subject: 'Aufgabe zugewiesen',
      from: "no-reply@cedis.fu-berlin.de",
      to: @receiver.email,
      date: Time.now
    )
  end

  def task_finished
    @receiver = params[:receiver]
    @task = params[:task]
    mail(
      subject: 'Aufgabe abgeschlossen',
      from: "no-reply@cedis.fu-berlin.de",
      to: @receiver.email,
      date: Time.now
    )
  end

  def task_restarted
    @receiver = params[:receiver]
    @task = params[:task]
    mail(
      subject: 'Aufgabe erneut geöffnet',
      from: "no-reply@cedis.fu-berlin.de",
      to: @receiver.email,
      date: Time.now
    )
  end

end
