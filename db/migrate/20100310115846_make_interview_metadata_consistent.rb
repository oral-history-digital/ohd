class MakeInterviewMetadataConsistent < ActiveRecord::Migration

  def self.up

    change_table :interviews do |t|
      t.string :first_name
      t.string :other_first_names
      t.string :last_name
      t.string :alias_names

      t.string :interview_date

      t.string :forced_labor_locations
      t.string :birth_location
      t.remove :home_location_id
      t.string :return_locations
      t.string :return_date

      t.string  :still_image_file_name
      t.string  :still_image_content_type
      t.integer :still_image_file_size
      t.datetime :still_image_updated_at
    end

    say_with_time 'copying data from interview_still to still_image' do
      sql = []
      %w(file_name content_type file_size updated_at).each do |attr|
        sql << "still_image_#{attr} = interview_still_#{attr}"
      end

      sql << "forced_labor_locations = forced_labor_location"

      Interview.update_all sql.join(', ')
    end

    change_table :interviews do |t|
      t.remove :interview_still_file_name
      t.remove :interview_still_content_type
      t.remove :interview_still_file_size
      t.remove :interview_still_updated_at

      t.remove :forced_labor_location
    end

  end

  def self.down

    change_table :interviews do |t|

      t.remove :first_name
      t.remove :other_first_names
      t.remove :last_name
      t.remove :alias_names

      t.remove :interview_date

      t.string :forced_labor_location
      t.remove :birth_location
      t.integer :home_location_id
      t.remove :return_locations
      t.remove :return_date

      t.string :interview_still_file_name
      t.string :interview_still_content_type
      t.integer :interview_still_file_size
      t.datetime :interview_still_updated_at

    end

    say_with_time 'copying data from still_image to interview_still' do
      sql = []
      %w(file_name content_type file_size updated_at).each do |attr|
        sql << "interview_still_#{attr} = still_image_#{attr}"
      end

      sql << "forced_labor_location = forced_labor_locations"

      Interview.update_all sql.join(', ')
    end

    change_table :interviews do |t|
      t.remove  :still_image_file_name
      t.remove  :still_image_content_type
      t.remove :still_image_file_size
      t.remove :still_image_updated_at

      t.remove :forced_labor_locations
    end

  end

end
