class ActiveRecord::SessionStore::Session

  belongs_to :user_account, optional: true
  
  before_update :set_user_account_id
  after_commit :limit_active_sessions

  ACTIVE_SESSION_LIMIT = 100

  scope :by_oldest, -> { order(updated_at: :asc) }

  private

  def set_user_account_id
    self.user_account_id = data['warden.user.user_account.key']&.first&.first
  end

  def limit_active_sessions
    user_sessions = ActiveRecord::SessionStore::Session.where(user_account_id: user_account_id)
    if user_sessions.count > ACTIVE_SESSION_LIMIT
      user_sessions.by_oldest.limit(1).delete_all
    end
  end
end

