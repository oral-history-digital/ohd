class AddColumnsToContributionTypes < ActiveRecord::Migration[5.2]
  def up
    add_column :contribution_types, :use_in_details_view, :boolean
    add_column :contribution_types, :order, :integer

    [
      'interviewer',
      'cinematographer',
      'sound',
      'producer',
      'other_attender',
      'transcriptor',
      'translator',
      'segmentator',
      'proofreader',
      'research',
    ].each_with_index do |code, index|
      ContributionType.find_or_create_by(code: code).update_attributes(use_in_details_view: true, order: index + 1)
    end

    [
      'quality_manager_interviewing',
      'quality_manager_transcription',
      'quality_manager_translation',
      'quality_manager_research',
    ].each_with_index do |code, index|
      ContributionType.find_or_create_by(code: code).update_attributes(order: index + 11)
    end
  end

  def down
    remove_column :contribution_types, :use_in_details_view
    remove_column :contribution_types, :order
  end
end
