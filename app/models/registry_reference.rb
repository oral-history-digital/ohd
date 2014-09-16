class RegistryReference < BaseRegistryReference

  belongs_to :interview

  named_scope :for_interview, lambda { |interview_id|
    {
        :joins => "LEFT JOIN segments s ON registry_references.ref_object_type = 'Segment'
                     AND registry_references.ref_object_id = s.id
                     AND s.interview_id = #{interview_id}",
        :conditions => "s.id IS NOT NULL OR (registry_references.ref_object_type = 'Interview' AND registry_references.ref_object_id = #{interview_id})"
    }
  }

  before_create :reconnect_reference

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
      I18n.available_locales.map do |locale|
        registry_entry.to_s_with_fallback(locale)
      end.uniq.reject(&:blank?).join(' ')
    end
    text :alias_names, :boost => 3 do
      alias_names = registry_entry.to_s(:alias)
      alias_names = '' if alias_names =~ Regexp.new(Regexp.escape(RegistryEntry::INVALID_ENTRY_TEXT)) # No aliases.
      alias_names
    end

    # Also index the reference by all parent entries (classification)
    # of the registry entry and its respective alias names.
    text :classification, :boost => 6 do
      registry_entry.ancestors.map do |ancestor|
        I18n.available_locales.map do |locale|
          ancestor.to_s_with_fallback(locale)
        end.uniq.reject(&:blank?).join(' ')
      end.join(' ')
    end
    text :classification_alias_names do
      registry_entry.ancestors.map do |ancestor|
        alias_names = ancestor.to_s(:alias)
        alias_names = nil if alias_names =~ Regexp.new(Regexp.escape(RegistryEntry::INVALID_ENTRY_TEXT))
        alias_names
      end.compact.join(' ')
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
    CeDiS.archive_category_ids.each do |category_id|
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
