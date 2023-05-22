class CustomDeviseMailer < Devise::Mailer
  helper :application # gives access to all helpers defined within `application_helper`.
  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
  default template_path: 'devise/mailer' # to make sure that your mailer uses the devise views
  # If there is an object in your application that returns a contact email, you can use it as follows
  # Note that Devise passes a Devise::Mailer object to your proc, hence the parameter throwaway (*).
  #default from: ->(*) { Class.instance.email_address }

  def project_access_granted(record, opts={})
    @project = opts[:project]
    @user_project = opts[:user_project]
    @conditions_link = @project.external_links.where(internal_name: 'conditions').first
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :project_access_granted, opts)
  end

  def project_access_rejected(record, opts={})
    @project = opts[:project]
    @user_project = opts[:user_project]
    @conditions_link = @project.external_links.where(internal_name: 'conditions').first
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :project_access_rejected, opts)
  end

  def project_access_terminated(record, opts={})
    @project = opts[:project]
    @user_project = opts[:user_project]
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :project_access_terminated, opts)
  end

  def project_access_blocked(record, opts={})
    @project = opts[:project]
    @user_project = opts[:user_project]
    @conditions_link = @project.external_links.where(internal_name: 'conditions').first
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :project_access_blocked, opts)
  end

  def project_access_block_revoked(record, opts={})
    @project = opts[:project]
    @user_project = opts[:user_project]
    @conditions_link = @project.external_links.where(internal_name: 'conditions').first
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :project_access_block_revoked, opts)
  end

  def user_blocked(record, opts={})
    @project = Project.ohd
    @conditions_link = @project.external_links.where(internal_name: 'conditions').first
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :user_blocked, opts)
  end

  def user_block_revoked(record, opts={})
    @project = Project.ohd
    @conditions_link = @project.external_links.where(internal_name: 'conditions').first
    opts[:from] = @project.contact_email
    opts[:reply_to] = @project.contact_email
    devise_mail(record, :user_block_revoked, opts)
  end

  def account_removed(record, opts={})
    opts[:from] = 'mail@oral-history.digital'
    opts[:reply_to] = 'mail@oral-history.digital' 
    devise_mail(record, :account_removed, opts)
  end

  def confirmation_instructions(record, token, opts={})
    @token = token

    if record.projects.count == 1
      project = record.projects.last
      domain = project.domain_with_optional_identifier
      contact_email = project.contact_email
      locale = record.default_locale || project.default_locale
      @project_name = project.name(record.default_locale)
      @application_type = :interview_archive
    else # if no project or more than one
      domain = OHD_DOMAIN
      contact_email = 'mail@oral-history.digital'
      locale = 'de'
      @project_name = 'Oral-History.Digital'
      @application_type = :interview_portal 
    end

    if record.unconfirmed_email
      @url = "#{domain}/#{locale}/users/#{record.id}/confirm_new_email?confirmation_token=#{record.confirmation_token}"
    else
      @url = "#{domain}/#{locale}/users/confirmation?confirmation_token=#{record.confirmation_token}"
    end

    opts[:from] = contact_email
    opts[:reply_to] = contact_email
    devise_mail(record, :confirmation_instructions, opts)
  end

  def reset_password_instructions(record, token, opts={})
    token = token
    project = opts[:project]

    if project
      domain = project.domain_with_optional_identifier
      contact_email = project.contact_email
      locale = record.default_locale || project.default_locale
      @project_name = project.name(record.default_locale)
    else # if no project or more than one
      domain = OHD_DOMAIN
      contact_email = 'mail@oral-history.digital'
      locale = 'de'
      @project_name = 'Oral-History.Digital'
    end

    @url = "#{domain}/#{locale}/users/password/edit?reset_password_token=#{token}"

    opts[:from] = contact_email
    opts[:reply_to] = contact_email
    devise_mail(record, :reset_password_instructions, opts)
  end

  def email_changed(record, opts={})
    devise_mail(record, :email_changed, opts)
  end

end
