namespace :solr do

  namespace :reindex do

    desc 'reindex segments in interview-chunks, and by this making use of the fact the includes(:translations) on interview#has_many :segments' 
    task :segments => :environment do
      start = Time.now
      p "starting to reindex segments per interview ..."
      Interview.all.each do |i|  
        start_interview = Time.now
        i.segments.each_slice(100) do |batch|
          Sunspot.index! batch
        end
        finish_interview = Time.now
        p "finished segments for interview #{i.archive_id} in #{(finish_interview - start_interview)} seconds."
      end
      finish = Time.now
      p "finished all segments in #{(finish - start)} seconds."
    end

    desc 'reindex interviews'
    task :interviews => :environment do
      start = Time.now
      p "starting to reindex interviews ..."
      Interview.reindex
      finish = Time.now
      p "finished all inetrviews in #{(finish - start)} seconds."
    end

    desc 'reindex registry_references'
    task :registry_references => :environment do
      start = Time.now
      p "starting to reindex registry_references ..."
      RegistryReference.reindex
      finish = Time.now
      p "finished all registry_references in #{(finish - start)} seconds."
    end

    desc 'reindex all'
    task :all => ['solr:reindex:interviews', 'solr:reindex:segments', 'solr:reindex:registry_references'] do
      RegistryReference.reindex
    end

  end

end
