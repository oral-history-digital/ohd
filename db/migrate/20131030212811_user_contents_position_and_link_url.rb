class UserContentsPositionAndLinkUrl < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog
    change_column :user_contents, :position, :integer, :default => 1
    say_with_time 'Updating user_annotation link_urls' do
      UserAnnotation.update_all ['link_url = ?', nil]
      Rake::Task['user_content:set_link_urls'].execute
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    change_column :user_contents, :position, :integer, :default => 100
  end
  end

end
