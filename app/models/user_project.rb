class UserProject < ApplicationRecord
  include Workflow

  belongs_to :user, touch: true
  belongs_to :project

  validates_uniqueness_of :project_id, scope: :user_id
  validates :project_id, :user_id, presence: true

  after_create do
    AdminMailer.with(user: self.user, project: project).new_registration_info.deliver_now if user.confirmed_at.present? && !project.grant_project_access_instantly?
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
    end
    state :project_access_postponed do
      event :grant_project_access,      :transitions_to => :project_access_granted
      event :reject_project_access,    :transitions_to => :project_access_rejected
    end
    state :project_access_rejected do
      event :grant_project_access,      :transitions_to => :project_access_granted
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
    user.touch
  end

  def grant_project_access
    self.update_attribute(:activated_at, Time.now)
    subject = I18n.t('devise.mailer.project_access_granted.subject', project_name: project.name(user.locale_with_project_fallback), locale: user.locale_with_project_fallback)
    CustomDeviseMailer.project_access_granted(user, {subject: subject, project: project}).deliver_now
  end

  def grant_project_access_instantly
    self.update_attribute(:activated_at, Time.now)
  end

  def reject_project_access
    update_attribute(:activated_at, nil)
    subject = I18n.t('devise.mailer.project_access_rejected.subject', project_name: project.name(user.locale_with_project_fallback), locale: user.locale_with_project_fallback)
    CustomDeviseMailer.project_access_rejected(user, {subject: subject, project: project}).deliver_now
  end

  [
    :job_description,
    :research_intentions,
    :specification,
    :organization,
  ].each do |attr|
    define_method(attr) do
      user.send(attr)
    end
    define_method("#{attr}=") do |value|
      user.send("#{attr}=", value)
    end
  end
end
