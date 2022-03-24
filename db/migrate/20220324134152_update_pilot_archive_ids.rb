class UpdatePilotArchiveIds < ActiveRecord::Migration[5.2]
  def up
    pilot = Project.where(shortname: 'pilot').first
    execute "UPDATE interviews SET archive_id = REPLACE(archive_id, 'pilot', 'pilot0') WHERE id IN (#{pilot.interviews.map(&:id).join(',')});"
    #execute "UPDATE segments SET archive_id = REPLACE(archive_id, 'pilot', 'pilot0') WHERE interview_id IN (#{pilot.interviews.map(&:id).join(',')});"
    execute "UPDATE registry_references SET archive_id = REPLACE(archive_id, 'pilot', 'pilot0') WHERE interview_id IN (#{pilot.interviews.map(&:id).join(',')});"
  end

  def down
    pilot = Project.where(shortname: 'pilot').first
    execute "UPDATE interviews SET archive_id = REPLACE(archive_id, 'pilot0', 'pilot') WHERE id IN (#{pilot.interviews.map(&:id).join(',')});"
    #execute "UPDATE segments SET archive_id = REPLACE(archive_id, 'pilot0', 'pilot') WHERE interview_id IN (#{pilot.interviews.map(&:id).join(',')});"
    execute "UPDATE registry_references SET archive_id = REPLACE(archive_id, 'pilot0', 'pilot') WHERE interview_id IN (#{pilot.interviews.map(&:id).join(',')});"
  end
end
