class UserProject < ApplicationRecord
  include Workflow

  belongs_to :user, touch: true
  belongs_to :project

  validates_uniqueness_of :project_id, scope: :user_id
  validates :project_id, :user_id, presence: true

  after_create do
    AdminMailer.with(user: self.user, project: project).new_registration_info.deliver_now if user.confirmed_at.present? && !project.grant_project_access_instantly?
  end

  accepts_nested_attributes_for :user

  workflow do

    # admin workflow
    state :project_access_requested do
      event :grant_project_access, :transitions_to => :project_access_granted
      event :reject_project_access, :transitions_to => :project_access_rejected
    end
    state :project_access_granted do
      event :terminate_project_access, :transitions_to => :project_access_terminated
      event :block_project_access, :transitions_to => :project_access_blocked
    end
    state :project_access_rejected do
      event :correct_project_access_data, :transitions_to => :project_access_requested
    end
    state :project_access_terminated do
      event :grant_project_access, :transitions_to => :project_access_granted
      event :request_project_access, :transitions_to => :project_access_requested
    end
    state :project_access_blocked do
      event :revoke_project_access_block, :transitions_to => :project_access_granted
    end

  end

  def workflow_states
    current_state.events.map{|e| e.first}
  end

  def workflow_state=(change)
    self.send("#{change}!")
    user.touch
  end

  def request_project_access
    AdminMailer.with(user: self.user, project: project).new_registration_info.deliver_now if user.confirmed_at.present? && !project.grant_project_access_instantly?
  end

  def grant_project_access
    update(activated_at: Date.today, processed_at: Date.today)
    subject = I18n.t('devise.mailer.grant_project_access.subject', project_name: project.name(user.locale_with_project_fallback), locale: user.locale_with_project_fallback)
    CustomDeviseMailer.access_mail(user, {subject: subject, project: project, user_project: self}).deliver_later(wait: 1.seconds)
  end

  def reject_project_access
    update(processed_at: Date.today)
    Doorkeeper::AccessToken.create!(resource_owner_id: user.id)
    subject = I18n.t('devise.mailer.reject_project_access.subject', project_name: project.name(user.locale_with_project_fallback), locale: user.locale_with_project_fallback)
    # wait until params are updated before sending the mail. Like this mail_text will be available in the mail.
    CustomDeviseMailer.access_mail(user, {subject: subject, project: project, user_project: self}).deliver_later(wait: 1.seconds)
  end

  def correct_project_access_data
    AdminMailer.with(user: self.user, project: project).corrected_project_access_data.deliver_later(wait: 1.seconds)
  end

  def terminate_project_access
    update(terminated_at: Date.today, processed_at: Date.today)
    subject = I18n.t('devise.mailer.terminate_project_access.subject', project_name: project.name(user.locale_with_project_fallback), locale: user.locale_with_project_fallback)
    CustomDeviseMailer.access_mail(user, {subject: subject, project: project, user_project: self}).deliver_later(wait: 1.seconds)
  end

  def block_project_access
    update(terminated_at: Date.today, processed_at: Date.today)
    subject = I18n.t('devise.mailer.block_project_access.subject', project_name: project.name(user.locale_with_project_fallback), locale: user.locale_with_project_fallback)
    CustomDeviseMailer.access_mail(user, {subject: subject, project: project, user_project: self}).deliver_later(wait: 1.seconds)
    AdminMailer.with(user: self.user, project: project).blocked_project_access.deliver_now
  end

  def revoke_project_access_block
    update(activated_at: Date.today, processed_at: Date.today)
    subject = I18n.t('devise.mailer.revoke_project_access_block.subject', project_name: project.name(user.locale_with_project_fallback), locale: user.locale_with_project_fallback)
    CustomDeviseMailer.access_mail(user, {subject: subject, project: project, user_project: self}).deliver_later(wait: 1.seconds)
  end

  [
    :appellation,
    :first_name,
    :last_name,
    :street,
    :zipcode,
    :city,
    :country,
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
