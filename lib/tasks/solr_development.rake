# Suppress logging during environment load for reindex task
if ARGV.include?('solr:reindex:scoped')
  require 'logger'
  
  # Suppress SQL logging by unsubscribing from notifications
  ActiveSupport::Notifications.unsubscribe("sql.active_record")
end

namespace :solr do
  namespace :reindex do
    desc "Reindex with project/limit/model scoping: pass PROJECT_SHORTNAME or PROJECT_ID; MODEL (default Interview); LIMIT and BATCH_SIZE"
    # Usage examples:
    #   bin/rake solr:reindex:scoped                                      # Reindex all Interview records
    #   bin/rake solr:reindex:scoped MODEL=RegistryEntry                  # Reindex all RegistryEntry records
    #   bin/rake solr:reindex:scoped PROJECT_SHORTNAME=za                 # Reindex Interviews for project 'za'
    #   bin/rake solr:reindex:scoped PROJECT_ID=1                         # Reindex Interviews for project with ID 1
    #   bin/rake solr:reindex:scoped LIMIT=100                            # Reindex first 100 Interview records
    #   bin/rake solr:reindex:scoped BATCH_SIZE=1000                      # Use batch size of 1000 (default 500)
    #   bin/rake solr:reindex:scoped MODEL=Interview PROJECT_SHORTNAME=za LIMIT=50 BATCH_SIZE=10
    #   bin/rake solr:reindex:scoped PROJECT_SHORTNAME=za LIMIT=10 WITH_RELATED=true  # Also index related people/segments/photos
    task scoped: :environment do
    model_name = ENV['MODEL'] || 'Interview'
    
    begin
      model = model_name.constantize
    rescue NameError
      puts "Error: Model '#{model_name}' not found"
      exit 1
    end

    unless model.respond_to?(:searchable) || model.respond_to?(:solr_index)
      puts "Error: Model '#{model_name}' is not searchable (no Sunspot configuration)"
      exit 1
    end

    project_short = ENV['PROJECT_SHORTNAME']
    project_id = ENV['PROJECT_ID']
    limit = ENV['LIMIT']&.to_i
    batch_size = (ENV['BATCH_SIZE'] || 500).to_i
    with_related = ENV['WITH_RELATED'] == 'true'

    if batch_size < 1
      puts "Error: BATCH_SIZE must be greater than 0"
      exit 1
    end

    scope = model.all

    if project_short
      begin
        project = Project.find_by!(shortname: project_short)
        scope = scope.where(project_id: project.id)
      rescue ActiveRecord::RecordNotFound
        puts "Error: Project with shortname '#{project_short}' not found"
        exit 1
      end
    elsif project_id
      scope = scope.where(project_id: project_id.to_i)
    end

    scope = scope.limit(limit) if limit && limit > 0

    puts "Sunspot reindex starting..."
    puts "  Model: #{model_name}"
    puts "  Project shortname: #{project_short || 'all'}"
    puts "  Project ID: #{project_id || 'all'}"
    puts "  Limit: #{limit || 'none'}"
    puts "  Batch size: #{batch_size}"
    
    total = scope.count
    puts "  Total records: #{total}"
    
    if total == 0
      puts "No records to index."
      exit 0
    end

    puts "\nIndexing..."
    puts "(Query output suppressed)"
    indexed = 0
    start_time = Time.current

    begin
      scope.find_in_batches(batch_size: batch_size) do |batch|
        Sunspot.index(batch)
        Sunspot.commit
        
        indexed += batch.size
        
        elapsed = Time.current - start_time
        rate = indexed / elapsed
        eta = (total - indexed) / rate
        
        puts "Indexed #{indexed}/#{total} (#{(indexed.to_f / total * 100).round(1)}%) - Rate: #{rate.round(1)}/s - ETA: #{eta.round(0)}s"
      end
    rescue StandardError => e
      puts "\nError during indexing: #{e.message}"
      puts e.backtrace.first(5).join("\n")
      exit 1
    end

    elapsed = Time.current - start_time
    puts "\nSunspot reindex finished successfully."
    puts "  Indexed: #{indexed} records"
    puts "  Duration: #{elapsed.round(1)}s"
    puts "  Average rate: #{(indexed / elapsed).round(1)} records/s"
    
    # Index related models if requested (only for Interview)
    if with_related && model_name == 'Interview'
      puts "\nIndexing related models..."
      interview_ids = scope.pluck(:id)
      
      # Index people
      puts "  Indexing people..."
      person_ids = Contribution.where(interview_id: interview_ids).pluck(:person_id).uniq
      if person_ids.any?
        Person.where(id: person_ids).find_in_batches(batch_size: batch_size) do |batch|
          Sunspot.index(batch)
        end
        Sunspot.commit
        puts "    ✓ Indexed #{person_ids.count} people"
      end
      
      # Index segments
      puts "  Indexing segments..."
      segment_ids = Segment.where(interview_id: interview_ids).pluck(:id)
      if segment_ids.any?
        Segment.where(id: segment_ids).find_in_batches(batch_size: batch_size) do |batch|
          Sunspot.index(batch)
        end
        Sunspot.commit
        puts "    ✓ Indexed #{segment_ids.count} segments"
      end
      
      # Index photos
      puts "  Indexing photos..."
      photo_ids = Photo.joins(:interview).where(interviews: { id: interview_ids }).pluck(:id)
      if photo_ids.any?
        Photo.where(id: photo_ids).find_in_batches(batch_size: batch_size) do |batch|
          Sunspot.index(batch)
        end
        Sunspot.commit
        puts "    ✓ Indexed #{photo_ids.count} photos"
      end
      
      puts "\n✓ Related models indexed successfully"
    end
    end
  end
end
