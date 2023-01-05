class RenameOtherAttendeesCode < ActiveRecord::Migration[5.2]
  def up
    ContributionType.where(code: 'other_attendees').update_all(code: 'other_attender')
    ContributionType.update_all updated_at: Time.now
    Contribution.update_all updated_at: Time.now
    Interview.update_all updated_at: Time.now
  end
  def down
    ContributionType.where(code: 'other_attender').update_all(code: 'other_attendees')
    ContributionType.update_all updated_at: Time.now
    Contribution.update_all updated_at: Time.now
    Interview.update_all updated_at: Time.now
  end
end
