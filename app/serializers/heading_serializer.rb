class HeadingSerializer < ActiveModel::Serializer
  include IsoHelpers

  attributes :id,
             :interview_id,
             :time,
             :tape_nbr,
             :mainheading,
             :subheading,
             :last_heading,
             :start_time,
             :end_time,
             :media_id,
             :timecode

  belongs_to :speaking_person, serializer: LightPersonSerializer

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

end
