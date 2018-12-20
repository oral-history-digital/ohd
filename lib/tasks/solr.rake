namespace :solr do

  namespace :reindex do

    desc 'reindex segments in interview-chunks, and by this making use of the fact the includes(:translations) on interview#has_many :segments' 
    task :segments => :environment do
      start = Time.now
      p "starting to reindex segments per interview ..."
      Interview.all.each do |i|  
        start_interview = Time.now
        i.segments.includes(:translations).each_slice(100) do |batch|
          Sunspot.index batch
        end
        finish_interview = Time.now
        p "finished segments for interview #{i.archive_id} in #{(finish_interview - start_interview)} seconds."
      end
      finish = Time.now
      p "finished all segments in #{(finish - start)} seconds."
    end

    %w(interview person biographical_entry photo registry_entry).each do |that|
      desc "reindex #{that.pluralize}"
      task that.pluralize.to_sym => :environment do
        start = Time.now
        p "starting to reindex #{that.pluralize} ..."
        that.classify.constantize.reindex
        finish = Time.now
        p "finished all #{that.pluralize} in #{(finish - start)} seconds."
      end
    end

    desc 'commit all indices'
    task :commit => :environment do
      Sunspot.commit
    end

    desc 'reindex all'
    task :all => ['solr:reindex:interviews', 'solr:reindex:people', 'solr:reindex:biographical_entries', 'solr:reindex:photos', 'solr:reindex:segments', 'solr:reindex:commit'] 

  end

end
