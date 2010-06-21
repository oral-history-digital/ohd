class UserRegistration < ActiveRecord::Base

  named_scope :unanswered, { :conditions => ['workflow_state = ?', 'unanswered'] }

end