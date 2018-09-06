class SegmentHitSerializer < ActiveModel::Serializer
  include IsoHelpers

  attributes :id,
             :interview_id,
             :time,
             :start_time,
             :end_time,
             :tape_nbr,
             :transcripts,
             :timecode,
             :speaker_id,
             :lead_segment_heading,

  def time
    # timecode as seconds 
    Time.parse(object.timecode).seconds_since_midnight
  end

  def tape_nbr
    object.tape.number
  end

  def transcripts
    {}
  end

  def lead_segment_heading
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.section_lead_segment.subheading(projectified(locale)) || object.section_lead_segment.mainheading(projectified(locale))
      mem
    end
  end

end
