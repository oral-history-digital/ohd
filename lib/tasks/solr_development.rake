namespace :solr do
  namespace :reindex do
    namespace :development do
      
      desc 'Reindex a limited number of records for development (default: 10 interviews)'
      task :limited, [:limit] => :environment do |task, args|
        limit = (args[:limit] || ENV['LIMIT'] || 10).to_i
        
        puts "Development mode: Limited reindexing (#{limit} interviews max)"
        start_time = Time.now
        
        # Temporarily suppress SQL logging but keep a logger for Sunspot
        old_logger = ActiveRecord::Base.logger
        if Rails.env.development?
          # Create a null logger that discards output instead of setting to nil
          null_logger = Logger.new(File::NULL)
          null_logger.level = Logger::FATAL  # Only show fatal errors
          ActiveRecord::Base.logger = null_logger
        end
        
        begin
          # Use incremental indexing - just reindex limited interviews like the working quick task
          puts "Incrementally indexing #{limit} interviews (no index clearing)..."
          Interview.limit(limit).reindex
          
          # Get the actual interview IDs that were indexed
          interview_ids = Interview.limit(limit).pluck(:id)
          puts "  ✅ Indexed #{interview_ids.count} interviews"
          
          # Now add related data incrementally too
          puts "Indexing people from selected interviews..."
          person_ids = Interview.where(id: interview_ids)
                               .joins(:contributions)
                               .pluck('contributions.person_id')
                               .uniq
          
          if person_ids.any?
            Person.where(id: person_ids).reindex
            puts "  ✅ Indexed #{person_ids.count} people"
          else
            puts "  No people found for selected interviews"
          end
          
          puts "Indexing segments from selected interviews..."
          segment_ids = Interview.where(id: interview_ids).joins(:segments).pluck('segments.id').uniq
          if segment_ids.any?
            Segment.where(id: segment_ids).reindex
            puts "  ✅ Indexed #{segment_ids.count} segments"
          else
            puts "  No segments found for selected interviews"
          end
          
          puts "Indexing photos from selected interviews..."
          photo_ids = Photo.joins(:interview).where(interviews: { id: interview_ids }).pluck(:id).uniq
          if photo_ids.any?
            Photo.where(id: photo_ids).reindex
            puts "  ✅ Indexed #{photo_ids.count} photos"
          else
            puts "  No photos found for selected interviews"
          end
          
          # Commit all changes
          puts "Committing changes to Solr..."
          Sunspot.commit
          
        ensure
          # Restore SQL logging
          ActiveRecord::Base.logger = old_logger if Rails.env.development?
        end
        
        finish_time = Time.now
        duration = finish_time - start_time
        
        puts ""
        puts "✅ Development reindex complete!"
        puts "   Duration: #{duration.round(1)} seconds"
        puts "   Indexed: #{interview_ids&.count || 0} interviews + related data"
        puts "   People: #{person_ids&.count || 0}"
        puts "   Segments: #{segment_ids&.count || 0}"
        puts "   Photos: #{photo_ids&.count || 0}"
        puts ""
        puts "💡 To index more records: bin/rails solr:reindex:development:limited[500]"
        puts "💡 For full reindex: bin/rails solr:reindex:all"
      end
      
      desc 'Reindex only the first N interviews (very fast, default: 10)'
      task :quick, [:limit] => :environment do |task, args|
        limit = (args[:limit] || ENV['LIMIT'] || 10).to_i
        
        puts "⚡ Quick development reindex (#{limit} interviews only)"
        start_time = Time.now
        
        # Suppress SQL logging but keep a logger for Sunspot
        old_logger = ActiveRecord::Base.logger
        if Rails.env.development?
          null_logger = Logger.new(File::NULL)
          null_logger.level = Logger::FATAL
          ActiveRecord::Base.logger = null_logger
        end
        
        begin
          # Clear and reindex just interviews using the model's reindex method
          Sunspot.remove_all
          Interview.limit(limit).reindex
          Sunspot.commit
        ensure
          ActiveRecord::Base.logger = old_logger if Rails.env.development?
        end
        
        duration = Time.now - start_time
        puts "✅ Quick reindex complete in #{duration.round(1)} seconds"
        puts "💡 For more data: bin/rails solr:reindex:development:limited[100]"
      end
    end
  end
end