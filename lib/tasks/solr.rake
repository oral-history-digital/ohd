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

    desc 'reindex interviews'
    task :interviews => :environment do
      start = Time.now
      p "starting to reindex interviews ..."
      Interview.reindex
      finish = Time.now
      p "finished all interviews in #{(finish - start)} seconds."
    end

    desc 'reindex people'
    task :people => :environment do
      start = Time.now
      p "starting to reindex people ..."
      Person.reindex
      finish = Time.now
      p "finished all people in #{(finish - start)} seconds."
    end

    desc 'reindex biographical_entries'
    task :biographical_entries => :environment do
      start = Time.now
      p "starting to reindex biographical_entries ..."
      BiographicalEntry.reindex
      finish = Time.now
      p "finished all biographical_entries in #{(finish - start)} seconds."
    end

    desc 'reindex photos'
    task :photos => :environment do
      start = Time.now
      p "starting to reindex photos ..."
      Photo.reindex
      finish = Time.now
      p "finished all photos in #{(finish - start)} seconds."
    end

    desc 'reindex registry_entries'
    task :registry_entries => :environment do
      start = Time.now
      p "starting to reindex registry_entries ..."
      RegistryEntry.reindex
      finish = Time.now
      p "finished all registry_entries in #{(finish - start)} seconds."
    end

    desc 'commit all indices'
    task :commit => :environment do
      Sunspot.commit
    end

    desc 'reindex all'
    task :all => ['solr:reindex:interviews', 'solr:reindex:people', 'solr:reindex:biographical_entries', 'solr:reindex:photos', 'solr:reindex:segments', 'solr:reindex:commit'] 

  end

end
