class AdminMailer < ApplicationMailer

  def new_registration_info
    user = params[:user]
    @project = params[:project]
    @user_name = user.full_name
    @url = "#{@project.domain_with_optional_identifier}/#{@project.default_locale}/users"

    mail(
      subject: TranslationValue.for('devise.mailer.new_registration_info.subject', @project.default_locale),
      **umbrella_mail_options,
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
      subject: TranslationValue.for('devise.mailer.corrected_project_access_data.subject', @project.default_locale),
      **umbrella_mail_options,
      to: @project.contact_email,
      date: Time.now
    )
  end

  def blocked_project_access
    @project = params[:project]
    @user = params[:user]
    @url = "#{@project.domain_with_optional_identifier}/#{@project.default_locale}/users"
    @umbrella_project_brand_name = InstanceSetting.current.umbrella_project_brand_name(:de)

    mail(
      subject: "Sperrung eines Nutzer*innen-Accounts in der Anwendung #{@project.name(:de)}",
      from: @project.contact_email,
      to: Project.umbrella.contact_email,
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
    @error = params[:error]
    subject = "Interview-Archiv #{@project_name} - #{TranslationValue.for('jobs.'+@type, 'de')} #{@filename}"
    mail(
      subject: subject,
      **umbrella_mail_options,
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
      **umbrella_mail_options,
      to: @receiver.email,
      date: Time.now
    )
  end

  def task_assigned
    @receiver = params[:receiver]
    @task = params[:task]
    mail(
      subject: 'Interview-Archiv: Aufgabe zugewiesen',
      **umbrella_mail_options,
      to: @receiver.email,
      date: Time.now
    )
  end

  def task_finished
    @receiver = params[:receiver]
    @task = params[:task]
    mail(
      subject: 'Interview-Archiv: Aufgabe abgeschlossen',
      **umbrella_mail_options,
      to: @receiver.email,
      date: Time.now
    )
  end

  def task_restarted
    @receiver = params[:receiver]
    @task = params[:task]
    mail(
      subject: 'Interview-Archiv: Aufgabe erneut geöffnet',
      **umbrella_mail_options,
      to: @receiver.email,
      date: Time.now
    )
  end

  private

  def umbrella_mail_options
    contact_email = Project.umbrella.contact_email
    { from: contact_email, reply_to: contact_email }
  end

end
