# Usage examples:
#
#   Display archives overview in console:
#     bin/rake stats:archives
#
#   Export archives overview to JSON:
#     bin/rake stats:archives FORMAT=json
#
#   Export archives overview to CSV:
#     bin/rake stats:archives FORMAT=csv
#
#   Output files are saved to tmp/ directory:
#     - tmp/archive_overview.json
#     - tmp/archive_overview.csv
#
#   The report includes:
#     - Overall summary (total projects, institutions, collections, interviews)
#     - Interview counts by status (public, available upon request, not available)
#     - Detailed table with one row per archive showing:
#       - Archive shortname and status (public/unshared)
#       - Number of collections
#       - Interview counts by status
#       - Total interviews per archive

namespace :stats do

  desc 'Display overview of archives and interviews (FORMAT=json or csv to export)'
  task :archives => :environment do

    format = ENV['FORMAT']&.downcase
    
    puts "\n" + "="*80
    puts "ARCHIVE OVERVIEW".center(80)
    puts "="*80 + "\n" unless format

    # Suppress SQL query logging
    old_logger = ActiveRecord::Base.logger
    ActiveRecord::Base.logger = nil

    begin
      # Projects/Archives
      unique_projects = Project.count
      puts "Projects/Archives:".ljust(40) + unique_projects.to_s.rjust(10)
      
      public_projects = Project.where(workflow_state: 'public').count
      puts "  → Public:".ljust(40) + public_projects.to_s.rjust(10)
      
      unshared_projects = Project.where(workflow_state: 'unshared').count
      puts "  → Unshared:".ljust(40) + unshared_projects.to_s.rjust(10)

      # Institutions
      unique_institutions = Institution.count
      puts "Institutions:".ljust(40) + unique_institutions.to_s.rjust(10)

      # Collections
      unique_collections = Collection.count
      puts "Collections:".ljust(40) + unique_collections.to_s.rjust(10)

      # Interviews - Total
      total_interviews = Interview.count
      puts "\nInterviews (Total):".ljust(40) + total_interviews.to_s.rjust(10)

      # Interviews - Public
      public_interviews = Interview.where(workflow_state: 'public').count
      puts "  → Public:".ljust(40) + public_interviews.to_s.rjust(10)

      # Interviews - Restricted (available upon request)
      restricted_interviews = Interview.where(workflow_state: 'restricted').count
      puts "  → Available upon request:".ljust(40) + restricted_interviews.to_s.rjust(10)

      # Interviews - Not yet available (unshared or other)
      not_available_interviews = Interview.where.not(workflow_state: ['public', 'restricted']).count
      puts "  → Not yet available:".ljust(40) + not_available_interviews.to_s.rjust(10)

      puts "\n" + "="*80
      puts "INTERVIEWS BY ARCHIVE".center(80)
      puts "="*80 + "\n"
      
      # Collect archive data
      archives_data = []
      Project.order(workflow_state: :asc, shortname: :asc).each do |project|
        collection_count = project.collections.count
        public_count = project.interviews.where(workflow_state: 'public').count
        available_count = project.interviews.where(workflow_state: 'restricted').count
        not_available_count = project.interviews.where.not(workflow_state: ['public', 'restricted']).count
        total_count = project.interviews.count
        
        archives_data << {
          archive: project.shortname,
          status: project.workflow_state,
          collections: collection_count,
          public: public_count,
          available: available_count,
          not_available: not_available_count,
          total: total_count
        }
      end
      
      # Export to JSON or CSV if requested
      if format == 'json'
        require 'json'
        output = {
          overview: {
            projects: unique_projects,
            projects_public: public_projects,
            projects_unshared: unshared_projects,
            institutions: unique_institutions,
            collections: unique_collections,
            interviews_total: total_interviews,
            interviews_public: public_interviews,
            interviews_available: restricted_interviews,
            interviews_not_available: not_available_interviews
          },
          archives: archives_data
        }
        File.write('tmp/archive_overview.json', JSON.pretty_generate(output))
        puts "✓ Exported to tmp/archive_overview.json"
      elsif format == 'csv'
        require 'csv'
        CSV.open('tmp/archive_overview.csv', 'w') do |csv|
          csv << ['Archive', 'Status', 'Collections', 'Public', 'Available', 'Not Available', 'Total']
          archives_data.each do |row|
            csv << [row[:archive], row[:status], row[:collections], row[:public], row[:available], row[:not_available], row[:total]]
          end
        end
        puts "✓ Exported to tmp/archive_overview.csv"
      else
        # Print table to console
        puts "Archive".ljust(20) + "Status".ljust(12) + "Collections".rjust(12) + "Public".rjust(10) + "Available".rjust(12) + "Not Available".rjust(15) + "Total".rjust(10)
        puts "-" * 101
        
        archives_data.each do |row|
          puts row[:archive].ljust(20) + row[:status].ljust(12) + row[:collections].to_s.rjust(12) + row[:public].to_s.rjust(10) + row[:available].to_s.rjust(12) + row[:not_available].to_s.rjust(15) + row[:total].to_s.rjust(10)
        end
      end

      puts "\n" + "="*80 + "\n"
    ensure
      ActiveRecord::Base.logger = old_logger
    end

  end

end
