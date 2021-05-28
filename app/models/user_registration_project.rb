class UserRegistrationProject < ApplicationRecord
  include Workflow

  STATES = %w(account_created account_confirmed project_access_granted project_access_postponed rejected account_deactivated)

  belongs_to :user_registration
  belongs_to :project

  validates_uniqueness_of :project_id, scope: :user_registration_id

  workflow do

    # admin workflow
    state :account_confirmed do
      event :grant_project_access, :transitions_to => :project_access_granted
      event :reject_project_access,    :transitions_to => :project_access_rejected
      event :postpone_project_access,  :transitions_to => :project_access_postponed
    end
    state :project_access_granted do
      event :reject_project_access,    :transitions_to => :project_access_rejected
      event :deactivate_account,    :transitions_to => :account_deactivated
    end
    state :project_access_postponed do
      event :grant_project_access,      :transitions_to => :project_access_granted
      event :reject_project_access,    :transitions_to => :project_access_rejected
      event :deactivate_account,    :transitions_to => :account_deactivated
    end
    state :project_access_rejected do
      event :grant_project_access,      :transitions_to => :project_access_granted
      event :deactivate_account,        :transitions_to => :account_deactivated
    end
    state :account_deactivated do
      event :reactivate_account, :transitions_to => :account_created
    end

  end

  def workflow_states
    current_state.events.map{|e| e.first}
  end

  def workflow_state=(change)
    self.send("#{change}!")
  end
end
