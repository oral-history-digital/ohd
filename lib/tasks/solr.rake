namespace :solr do

  namespace :reindex do

    desc 'reindex segments in interview-chunks, and by this making use of the fact the includes(:translations) on interview#has_many :segments'
    task :segments => :environment do
      start = Time.now
      interview_count = Interview.count
      segment_count = Segment.count
      puts "Starting to reindex approx. #{segment_count} segments for #{interview_count} interviews ..."
      Interview.all.each_with_index do |interview, index|
        start_interview = Time.now
        interview_segment_count = interview.segments.count
        interview.segments.includes(:translations).each_slice(100) do |batch|
          Sunspot.index batch
        end
        finish_interview = Time.now
        delta = finish_interview - start_interview
        puts "#{index + 1}/#{interview_count}: Finished #{interview_segment_count} segments for interview #{interview.archive_id} in #{delta.round(1)} seconds."
      end
      finish = Time.now
      puts "Finished approx. #{segment_count} segments in #{(finish - start)} seconds."
    end

    %w(interview person biographical_entry photo registry_entry annotation event).each do |that|
      desc "reindex #{that.pluralize}"
      task that.pluralize.to_sym => :environment do
        start = Time.now
        record_count = that.classify.constantize.count
        puts "Starting to reindex #{record_count} #{that.pluralize} ..."
        that.classify.constantize.reindex
        finish = Time.now
        delta = finish - start
        puts "Finished #{record_count} #{that.pluralize} in #{delta.round(1)} seconds."
      end
    end

    desc 'commit all indices'
    task :commit => :environment do
      Sunspot.commit
    end

    desc 'reindex all'
    task :all => [
      'solr:reindex:interviews',
      'solr:reindex:people',
      'solr:reindex:biographical_entries',
      'solr:reindex:photos',
      'solr:reindex:registry_entries',
      'solr:reindex:annotations',
      'solr:reindex:segments',
      'solr:reindex:commit'
    ]
  end

end
