class InterviewSerializer < InterviewBaseSerializer
  attributes [
    :last_segments_ids,
    :first_segments_ids,
    :workflow_state,
    :workflow_states,
    :doi_status,
    :signature_original,
    :task_ids,
    :tasks_user_ids,
    :tasks_supervisor_ids,
    :photos,
    :materials,
    :title,
    :short_title,
    :segments,
  ]

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

  %w(photos registry_references materials).each do |rel|
    define_method rel do
      object.send(rel).inject({}) { |mem, c| mem[c.id] = "#{c.class.name}Serializer".constantize.new(c); mem }
    end
  end

  %w(title short_title description observations).each do |m|
    define_method m do
      object.localized_hash(m)
    end
  end

  def segments
    instance_options[:segments]
  end
end
