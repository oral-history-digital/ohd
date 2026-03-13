namespace :institutions do
  desc 'Export institutions to CSV'
  task export_to_csv: :environment do
    filename = Rails.root.join('tmp', 'institutions.csv').to_s
    locales = I18n.available_locales
    
    CSV.open(filename, 'w', **CSV_OPTIONS.merge(headers: true)) do |csv|
      # Build header with static fields and translated columns for each locale
      header = ['ID', 'Shortname', 'Parent Institution', 'Street', 'ZIP', 'City', 'Country', 
                'Latitude', 'Longitude', 'ISIL', 'GND', 'Website', 'Number of Projects', 'Number of Interviews']
      locales.each do |locale|
        header << "Name (#{locale})"
        header << "Description (#{locale})"
      end
      csv << header
      
      Institution.includes(:translations, :parent).find_each do |institution|
        row = [
          institution.id,
          institution.shortname,
          institution.parent&.name || '',
          institution.street,
          institution.zip,
          institution.city,
          institution.country,
          institution.latitude,
          institution.longitude,
          institution.isil,
          institution.gnd,
          institution.website,
          institution.num_projects,
          institution.num_interviews
        ]
        
        locales.each do |locale|
          row << institution.translations.find_by(locale: locale.to_s)&.name
          row << institution.translations.find_by(locale: locale.to_s)&.description
        end
        
        csv << row
      end
    end
    
    puts "Exported #{Institution.count} institutions to #{filename}"
  end
end
