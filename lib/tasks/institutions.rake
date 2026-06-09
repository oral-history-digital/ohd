namespace :institutions do
  # Build a hash mapping each institution ID to an array of itself and its direct children IDs
  def institution_ids_with_direct_children
    children_by_parent_id = Institution
      .where.not(parent_id: nil)
      .pluck(:parent_id, :id)
      .group_by(&:first)
      .transform_values { |pairs| pairs.map(&:second) }

    Institution
      .pluck(:id)
      .to_h do |institution_id|
        [
          institution_id,
          [institution_id] + (children_by_parent_id[institution_id] || [])
        ]
      end
  end

  def count_projects_by_institution
    institution_ids_with_direct_children.transform_values do |institution_ids|
      InstitutionProject
        .where(institution_id: institution_ids)
        .distinct
        .count(:project_id)
    end
  end

  def count_collections_by_institution
    institution_ids_with_direct_children.transform_values do |institution_ids|
      Collection
        .joins(project: :institution_projects)
        .where(institution_projects: { institution_id: institution_ids })
        .distinct
        .count(:id)
    end
  end

  def count_interviews_by_institution
    institution_ids_with_direct_children.transform_values do |institution_ids|
      Interview
        .joins(project: :institution_projects)
        .where(institution_projects: { institution_id: institution_ids })
        .distinct
        .count(:id)
    end
  end

  desc 'Export institutions to CSV (optionally specify LOCALE=<locale>)'
  task export_to_csv: :environment do
    filename = Rails.root.join('tmp', 'institutions.csv').to_s
    locale = ENV['LOCALE']&.to_sym || I18n.default_locale

    project_counts = count_projects_by_institution
    collection_counts = count_collections_by_institution
    interview_counts = count_interviews_by_institution

    CSV.open(filename, 'w', **CSV_OPTIONS.merge(headers: true)) do |csv|
      # Build header with static fields and translated columns for each locale
      header = [
        'ID',
        'Name',
        'Shortname',
        'Parent Institution',
        'Street',
        'ZIP',
        'City',
        'Country',
        'Latitude',
        'Longitude',
        'ISIL',
        'GND',
        'Website',
        'Number of Projects',
        'Number of Collections',
        'Number of Interviews',
        'Description'
      ]

      csv << header

      Institution.includes(:translations, :parent).find_each do |institution|
        translations_by_locale = institution.translations.index_by { |t| t.locale.to_s }
        translation = translations_by_locale[locale.to_s]

        row = [
          institution.id,
          translation&.name || '',
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
          project_counts[institution.id] || 0,
          collection_counts[institution.id] || 0,
          interview_counts[institution.id] || 0,
          translation&.description || ''
        ]

        csv << row
      end
    end

    puts "Exported #{Institution.count} institutions to #{filename} (locale: #{locale})"
  end
end