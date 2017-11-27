class UserContentsPositionAndLinkUrl < ActiveRecord::Migration

  def self.up
    change_column :user_contents, :position, :integer, :default => 1
  unless Project.name.to_sym == :mog
    say_with_time 'Updating user_annotation link_urls' do
      UserAnnotation.update_all ['link_url = ?', nil]
      Rake::Task['user_content:set_link_urls'].execute
    end
  end
  end

  def self.down
  #unless Project.name.to_sym == :mog
    change_column :user_contents, :position, :integer, :default => 100
  #end
  end

end
