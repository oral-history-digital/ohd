namespace :counters do
  desc "Recalculate counter caches for projects, collections, and institutions. Optional filters: PROJECT_ID=... INSTITUTION_ID=..."
  task refresh: :environment do
    project_scope = ENV["PROJECT_ID"].present? ? Project.where(id: ENV["PROJECT_ID"]) : Project.all
    institution_scope = ENV["INSTITUTION_ID"].present? ? Institution.where(id: ENV["INSTITUTION_ID"]) : Institution.all
    
    # Disable logging to avoid cluttering logs with many update statements.
    original_logger = ActiveRecord::Base.logger
    ActiveRecord::Base.logger = nil

    project_processed = 0
    project_changed = 0
    puts "Refreshing project interview counters..."
    project_scope.find_each do |project|
      old_count = project.interviews_count
      project.update_interviews_count
      project.reload
      project_processed += 1
      project_changed += 1 if old_count != project.interviews_count
    end
    puts "  Projects processed: #{project_processed}, changed: #{project_changed}"

    collection_processed = 0
    collection_changed = 0
    puts "Refreshing collection interview counters..."
    collection_scope = if ENV["PROJECT_ID"].present?
      Collection.where(project_id: project_scope.select(:id))
    else
      Collection.all
    end
    collection_scope.find_each do |collection|
      old_count = collection.interviews_count
      collection.update_interviews_count
      collection.reload
      collection_processed += 1
      collection_changed += 1 if old_count != collection.interviews_count
    end
    puts "  Collections processed: #{collection_processed}, changed: #{collection_changed}"

    institution_processed = 0
    institution_projects_changed = 0
    institution_interviews_changed = 0
    puts "Refreshing institution counters..."
    institution_scope.find_each do |institution|
      old_projects_count = institution.projects_count
      old_interviews_count = institution.interviews_count

      institution.update_projects_count
      institution.update_interviews_count
      institution.touch

      institution.reload
      institution_processed += 1
      institution_projects_changed += 1 if old_projects_count != institution.projects_count
      institution_interviews_changed += 1 if old_interviews_count != institution.interviews_count
    end
    puts "  Institutions processed: #{institution_processed}, projects_count changed: #{institution_projects_changed}, interviews_count changed: #{institution_interviews_changed}"
    puts "Counter refresh complete."
  ensure
    ActiveRecord::Base.logger = original_logger
  end
end
