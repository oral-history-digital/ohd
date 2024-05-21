class InterviewSerializer < InterviewBaseSerializer
  attributes [
    :last_segments_ids,
    :first_segments_ids,
    :workflow_state,
    :workflow_states,
    :doi_status,
    :landing_page_texts,
    :signature_original,
    :task_ids,
    :tasks_user_ids,
    :tasks_supervisor_ids,
  ]

  def landing_page_texts
    json = Rails.cache.fetch("#{object.project.shortname}-landing-page-texts-#{object.archive_id}-#{object.project.updated_at}") do
      interviewee = object.interviewee
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.project.landing_page_text(locale) && object.project.landing_page_text(locale).gsub('INTERVIEWEE', object.project.fullname_on_landing_page ? object.short_title(locale) : object.anonymous_title(locale))
        mem
      end
    end
  end

  def last_segments_ids
    tape_counter = 0
    object.tapes.inject({}) do |mem, tape|
      begin
        tape_counter += 1
        mem[tape_counter] = tape.segments.last.id
        mem
      rescue
        mem
      end
    end
  end

  def first_segments_ids
    tape_counter = 0
    object.tapes.inject({}) do |mem, tape|
      begin
        tape_counter += 1
        mem[tape_counter] = tape.segments.where.not(timecode: "00:00:00.000").first.id
        mem
      rescue
        mem
      end
    end
  end

end
