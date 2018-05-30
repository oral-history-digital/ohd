class SegmentSerializer < ActiveModel::Serializer
  include IsoHelpers

  attributes :id,
             :interview_id,
             :time,
             :tape_nbr,
             :transcripts,
             :mainheading,
             :subheading,
             :last_heading,
             :annotation_texts,
             :start_time,
             :end_time,
             :references_count,
             :references,
             :media_id,
             :timecode,
             :speaker_changed,
             :speaker_id
             #:speaker_is_interviewee

  belongs_to :speaking_person, serializer: PersonSerializer

  def speaker_changed
   object.speaker_changed
  end

  #def speaker_is_interviewee
    #object.speaker_id == object.interview.interviewees.first.id
  #end

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

  def tape_nbr
    #object.timecode.scan(/\[(\d*)\]/).flatten.first.to_i
    object.tape.number
  end

  def mainheading
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.mainheading(projectified(locale))
      mem
    end
  end

  def subheading
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.subheading(projectified(locale))
      mem
    end
  end

  def last_heading
    mainheadings = Segment.mainheadings_until(object.id, object.interview_id)
    if mainheadings.count > 0
      mainheadings_count = mainheadings.map{|mh| mh.mainheading(projectified(Project.available_locales.first))}.uniq.count
      subheadings = Segment.subheadings_until(object.id, object.interview_id, mainheadings.last.id)
      
      if subheadings.count > 0
        I18n.available_locales.inject({}) do |mem, locale|
          mem[locale] = "#{mainheadings_count}.#{subheadings.count}. #{subheadings.last.subheading(projectified(locale))}"
          mem
        end
      else
        I18n.available_locales.inject({}) do |mem, locale|
          mem[locale] = "#{mainheadings_count}. #{mainheadings.last.mainheading(projectified(locale))}"
          mem
        end
      end
    end
  end

  def annotation_texts
    object.annotations.map(&:localized_hash)
  end

  def references_count
    object.registry_references.count
  end

  def references
    object.registry_references.select{|rr| rr.registry_entry}.map do |ref|
      {
        id: ref.registry_entry.id,
        desc: ref.registry_entry.localized_hash,
        desc_with_note: ref.registry_entry.localized_with_note,
        #desc: ref.registry_entry.descriptor(:all),
        latitude: ref.registry_entry.latitude.blank? ? nil : ref.registry_entry.latitude.to_f,
        longitude: ref.registry_entry.longitude.blank? ? nil : ref.registry_entry.longitude.to_f
      }
    end
  end
end
