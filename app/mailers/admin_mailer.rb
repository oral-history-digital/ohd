class AdminMailer < ApplicationMailer

  def new_registration_info
    user = params[:user]
    @project = params[:project]
    @user_name = user.full_name
    @url = "#{@project.domain_with_optional_identifier}/#{@project.default_locale}/users"

    mail(
      subject: "Neue Registrierung zur Prüfung",
      from: "noreply@cedis.fu-berlin.de",
      to: @project.contact_email,
      date: Time.now
    )
  end

  def corrected_project_access_data
    user = params[:user]
    @project = params[:project]
    @user_name = user.full_name
    @url = "#{@project.domain_with_optional_identifier}/#{@project.default_locale}/users"

    mail(
      subject: "Korrigierte Benutzerdaten zur Prüfung",
      from: "noreply@cedis.fu-berlin.de",
      to: @project.contact_email,
      date: Time.now
    )
  end

  def blocked_project_access
    @project = params[:project]
    @user = params[:user]
    @url = "#{@project.domain_with_optional_identifier}/#{@project.default_locale}/users"

    mail(
      subject: "Sperrung eines Nutzer*innen-Accounts in der Anwendung #{@project.name(:de)}",
      from: @project.contact_email,
      to: "mail@cedis.fu-berlin.de",
      date: Time.now
    )
  end

  def finished_job
    @receiver = params[:receiver]
    @type = params[:type]
    @interview = params[:interview]
    @project = params[:project]
    @project_name = (@project && @project.name) || (@interview && @interview.project.name)
    @file = params[:file]
    @filename = @file && @file.split('/').last
    @locale = params[:locale]
    subject = "Interview-Archiv #{@project_name} - #{I18n.backend.translate(:de, 'jobs.'+@type)} #{@filename}"
    mail(
      subject: subject,
      from: "noreply@cedis.fu-berlin.de",
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
      subject: 'Interview-Archiv: Neuer Kommentar',
      from: "noreply@cedis.fu-berlin.de",
      to: @receiver.email,
      date: Time.now
    )
  end

  def task_assigned
    @receiver = params[:receiver]
    @task = params[:task]
    mail(
      subject: 'Interview-Archiv: Aufgabe zugewiesen',
      from: "noreply@cedis.fu-berlin.de",
      to: @receiver.email,
      date: Time.now
    )
  end

  def task_finished
    @receiver = params[:receiver]
    @task = params[:task]
    mail(
      subject: 'Interview-Archiv: Aufgabe abgeschlossen',
      from: "noreply@cedis.fu-berlin.de",
      to: @receiver.email,
      date: Time.now
    )
  end

  def task_restarted
    @receiver = params[:receiver]
    @task = params[:task]
    mail(
      subject: 'Interview-Archiv: Aufgabe erneut geöffnet',
      from: "noreply@cedis.fu-berlin.de",
      to: @receiver.email,
      date: Time.now
    )
  end

end
