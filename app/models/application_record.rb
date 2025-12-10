class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def localized_hash(att)
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = localized_value(att, locale) 
      mem
    end
  end

  def localized_value(att, locale)
    self.send(att, locale)
  rescue ArgumentError => e
    self.send(att)
  end

  # following method is only used in models with a worflow_state-attribute
  # these models included Workflow before, but for most of our models except 
  # UserRegistration and Task Workflow is useless and would just complicate things
  # or result in workarounds which kill all of it s functionality like
  # commit bc6182762df3bad2cf62421c35e346c0c61af995
  #
  def workflow_states
    ['public', 'unshared']
  end

  def identifier
    self.id
  end

  def ohd_subject_registry_entry_ids
    if respond_to?(:interviews) && RegistryEntry.ohd_subjects
      RegistryReference.where(
        registry_entry_id: RegistryEntry.ohd_subjects.children.pluck(:id),
        ref_object_id: interviews.pluck(:id),
        ref_object_type: "Interview",
      ).pluck(:registry_entry_id).uniq
    else
      []
    end
  end

  def ohd_subject_registry_entries
    if respond_to?(:interviews)
      ohd_subject_registry_entry_ids.map do |id|
        {
          descriptor: RegistryEntry.find(id).localized_hash(:descriptor),
        }
      end
    else
      []
    end
  end

  def oai_base_subject_tags(xml, format=:dc)
    subjects = [
      {
        lang: :de,
        scheme: "Gemeinsame Normdatei (GND)",
        schemURI: "http://dnb.de/gnd/",
        valueURI: "https://d-nb.info/gnd/4115456-3",
        descriptor: "Oral History",
      },
      {
        lang: :en,
        scheme: "Gemeinsame Normdatei (GND)",
        schemURI: "http://dnb.de/gnd/",
        valueURI: "https://d-nb.info/gnd/4115456-3",
        descriptor: "Oral History",
      },
      {
        lang: :de,
        scheme: "Fields of Science and Technology (FOS)",
        schemURI: "https://web-archive.oecd.org/2012-06-15/138575-38235147.pdf",
        classificationCode: "6.1",
        descriptor: "FOS: History and archaeology",
      }
    ]
    subjects.each do |subject|
      opts = {
        subjectScheme: subject[:scheme],
        schemeURI: subject[:schemURI],
      }
      if subject[:valueURI]
        opts[:valueURI] = subject[:valueURI]
      end
      if subject[:classificationCode]
        opts[:classificationCode] = subject[:classificationCode]
      end
      xml.tag! "#{format == :dc ? 'dc:' : ''}subject", subject[:descriptor], opts.merge({ "xml:lang": subject[:lang] })
    end
  end

  def oai_subject_tags(xml, format=:dc)
    oai_subject_registry_entries.each do |registry_entry|
      opts = {}
      if registry_entry.norm_data.gnd.any?
        opts[:schemeURI] = "http://dnb.de/gnd/"
        opts[:valueURI] = "https://d-nb.info/gnd/#{registry_entry.norm_data.gnd.first.nid}"
        opts[:subjectScheme] = "Gemeinsame Normdatei (GND)"
      end
      [:de, :en].each do |locale|
        entry_name = registry_entry.to_s(locale, fallback: false)
        if !entry_name.blank?
          opts = opts.merge({ "xml:lang": locale })
          xml.tag! "#{format == :dc ? 'dc:' : ''}subject", entry_name, opts
        end
      end
    end
  end

  def ohd_level_of_indexing_registry_entry_groups
    if respond_to?(:interviews) && RegistryEntry.ohd_level_of_indexing
      RegistryReference.where(
        registry_entry_id: RegistryEntry.ohd_level_of_indexing.children.pluck(:id),
        ref_object_id: interviews.pluck(:id),
        ref_object_type: "Interview",
      ).group(:registry_entry_id).count
    else
      []
    end
  end

  def ohd_level_of_indexing_registry_entries
    if respond_to?(:interviews)
      ohd_level_of_indexing_registry_entry_groups.map do |id, count|
        {
          descriptor: RegistryEntry.find(id).localized_hash(:descriptor),
          count: count
        }
      end
    else
      []
    end
  end
end
