class UserRegistrationProject < ApplicationRecord
  include Workflow

  belongs_to :user_registration, touch: true
  has_one :user_account, through: :user_registration
  belongs_to :project

  validates_uniqueness_of :project_id, scope: :user_registration_id
  validates :project_id, :user_registration_id, presence: true

  after_create do
    AdminMailer.with(registration: self.user_registration, project: project).new_registration_info.deliver_now if user_registration.activated_at
  end

  workflow do

    # admin workflow
    state :account_confirmed do
      event :grant_project_access, :transitions_to => :project_access_granted
      event :grant_project_access_instantly, :transitions_to => :project_access_granted
      event :reject_project_access,    :transitions_to => :project_access_rejected
      event :postpone_project_access,  :transitions_to => :project_access_postponed
    end
    state :project_access_granted do
      event :reject_project_access,    :transitions_to => :project_access_rejected
      #event :deactivate_account,    :transitions_to => :account_deactivated
    end
    state :project_access_postponed do
      event :grant_project_access,      :transitions_to => :project_access_granted
      event :reject_project_access,    :transitions_to => :project_access_rejected
      #event :deactivate_account,    :transitions_to => :account_deactivated
    end
    state :project_access_rejected do
      event :grant_project_access,      :transitions_to => :project_access_granted
      #event :deactivate_account,        :transitions_to => :account_deactivated
    end
    state :account_deactivated do
      event :reactivate_account, :transitions_to => :project_access_granted
    end

  end

  def workflow_states
    current_state.events.map{|e| e.first}
  end

  def workflow_state=(change)
    self.send("#{change}!")
    user_registration.touch
  end

  # TODO: check how the token expires
  def expire_confirmation_token
    self.user_account.update_attribute(:confirmation_token, nil)
  end

  def grant_project_access
    self.update_attribute(:activated_at, Time.now)
    subject = I18n.t('devise.mailer.project_access_granted.subject', project_name: project.name(user_account.locale_with_project_fallback), locale: user_account.locale_with_project_fallback)
    CustomDeviseMailer.project_access_granted(user_account, {subject: subject, project: project}).deliver_now
  end

  def grant_project_access_instantly
    self.update_attribute(:activated_at, Time.now)
  end

  def reject_project_access
    update_attribute(:activated_at, nil)
    subject = I18n.t('devise.mailer.project_access_rejected.subject', project_name: project.name(user_account.locale_with_project_fallback), locale: user_account.locale_with_project_fallback)
    CustomDeviseMailer.project_access_rejected(user_account, {subject: subject, project: project}).deliver_now
  end

  # Flags the account as deactivated and removes project access
  # 
  # this should only be possible from OHD, not from a single project!
  #
  #def deactivate_account
    #update_attribute(:activated_at, nil)
    #user_account.update_attribute(:admin, nil)
    #user_account.deactivate!
    ## FIXME: why is self.default_locale always 'de'? we use user_account.default_locale for now
    #subject = I18n.t('devise.mailer.account_deactivated.subject', project_name: project.name(user_account.locale_with_project_fallback), locale: user_account.locale_with_project_fallback)
    #CustomDeviseMailer.account_deactivated(user_account, {subject: subject, project: project}).deliver_now
  #end

  def reactivate_account
    user_account.reactivate!
    # FIXME: devise confirmation instructions uses I18n.locale for the email subject - to prevent this, we could use a custom template
    user_account.resend_confirmation_instructions
  end
end
