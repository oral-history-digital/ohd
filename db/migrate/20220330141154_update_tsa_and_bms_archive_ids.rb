class UpdateTsaAndBmsArchiveIds < ActiveRecord::Migration[5.2]
  def up
    tsa = Project.where(shortname: 'tsa').first
    if tsa.present?
      execute "UPDATE interviews SET archive_id = REPLACE(archive_id, 'tsa', 'tsa0') WHERE id IN (#{tsa.interviews.map(&:id).join(',')});"
      execute "UPDATE registry_references SET archive_id = REPLACE(archive_id, 'tsa', 'tsa0') WHERE interview_id IN (#{tsa.interviews.map(&:id).join(',')});"
    end
    bms = Project.where(shortname: 'bms').first
    if bms.present?
      execute "UPDATE interviews SET archive_id = REPLACE(archive_id, 'bms', 'bms0') WHERE id IN (#{bms.interviews.map(&:id).join(',')});"
      execute "UPDATE registry_references SET archive_id = REPLACE(archive_id, 'bms', 'bms0') WHERE interview_id IN (#{bms.interviews.map(&:id).join(',')});"
    end
  end

  def down
    tsa = Project.where(shortname: 'tsa').first
    if tsa.present?
      execute "UPDATE interviews SET archive_id = REPLACE(archive_id, 'tsa0', 'tsa') WHERE id IN (#{tsa.interviews.map(&:id).join(',')});"
      execute "UPDATE registry_references SET archive_id = REPLACE(archive_id, 'tsa0', 'tsa') WHERE interview_id IN (#{tsa.interviews.map(&:id).join(',')});"
    end
    bms = Project.where(shortname: 'bms').first
    if bms.present?
      execute "UPDATE interviews SET archive_id = REPLACE(archive_id, 'bms0', 'bms') WHERE id IN (#{bms.interviews.map(&:id).join(',')});"
      execute "UPDATE registry_references SET archive_id = REPLACE(archive_id, 'bms0', 'bms') WHERE interview_id IN (#{bms.interviews.map(&:id).join(',')});"
    end
  end
end
