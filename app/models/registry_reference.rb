class RegistryReference < BaseRegistryReference

  belongs_to :interview
  belongs_to :ref_object, polymorphic: true

  scope :for_interview, -> (interview_id) { 
    where({interview_id: interview_id, ref_object_type: 'Segment'}) 
  }

  scope :with_locations, -> { 
    joins(:registry_entry).
    includes(registry_entry: {registry_names: :translations} ).
    where.not('registry_entries.longitude': nil).where.not('registry_entries.latitude': nil)
  }

  before_validation :reconnect_reference

  # Set an alternative ID that will allow us to re-connect the
  # reference in the context of the public archive.
  def alternative_id= (value)
    @alternative_id = value
  end

  def reconnect_reference
    case ref_object_type
      when 'Segment' then
        segment = Segment.for_media_id(@alternative_id).first
        self.ref_object = segment
        self.interview_id = segment.interview_id
      when 'Person' then
        interview = Interview.find_by_archive_id(@alternative_id)
        self.ref_object = interview
        self.interview_id = interview.id
      else
        raise 'Imported invalid ref object type.'
    end
    raise "Cannot reconnect reference with #{@alternative_id}." if ref_object.blank?
  end

  searchable :auto_index => false do
    # Index the reference by registry entry descriptor and alias names.
    text :registry_entry, :boost => 12 do
      registry_entry.search_string
    end

    # Also index the reference by all parent entries (classification)
    # of the registry entry and its respective alias names.
    text :classification, :boost => 6 do
      registry_entry.ancestors.map do |ancestor|
        ancestor.search_string
      end.join(' ')
    end
  end

  def self.search(query={})
    Sunspot.search RegistryReference do
      keywords query[:term]

      if query[:page].blank?
        self.paginate :page => 1, :per_page => 800
      else
        self.paginate :page => query[:page].to_i, :per_page => 50
      end

      adjust_solr_params do |params|
        params[:defType] = 'edismax'
      end
    end
  end

  def json_attrs
    json = {}
    json['id'] = self.id
    json['interviewId'] = interview.archive_id
    json['interviewee'] = interview.anonymous_title(I18n.locale)
    json['language'] = interview.language.to_s
    json['translated'] = interview.translated
    json['interviewType'] = interview.video ? 'video' : 'audio'
    Project.archive_category_ids.each do |category_id|
      json[category_id.to_s] = self.interview.send("#{category_id.to_s.singularize}_names")
    end
    json['descriptor'] = registry_entry.to_s(I18n.locale)
    json['referenceType'] = registry_reference_type.nil? ? '' : self.registry_reference_type.to_s
    json['mainRegisters'] = registry_entry.main_registers.map(&:to_s).join(';')
    json['longitude'] = registry_entry.longitude
    json['latitude'] = registry_entry.latitude
    json
  end

end
