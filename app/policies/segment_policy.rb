class SegmentPolicy < ApplicationPolicy
  # Requires access to the segment's actual parent interview before serialization.
  #
  # @return [Boolean, nil] Whether the logged-in user may read the segment
  def show?
    user && InterviewPolicy.new(ProjectContext.new(user, project), record.interview).content?
  end

  class Scope < Scope
    attr_reader :user, :segment, :project

    def initialize(project_context, segment)
      @user = project_context.user
      @project = project_context.project
      @segment = segment
    end

    # Checks parent-interview access before reading cached segment contents.
    #
    # @return [Hash] Serialized segments grouped by tape
    # @raise [Pundit::NotAuthorizedError] When interview contents are inaccessible
    def resolve
      if user && InterviewPolicy.new(ProjectContext.new(user, project), segment.interview).content?
        interview = segment.interview
        transcript_coupled = interview.transcript_coupled
        max_updated_at = interview.segments.maximum(:updated_at)
        allowed_to_see_all = user.admin? || user.roles?(interview.project, 'Segment', 'update') ||
          user.task_permissions?(interview.project, interview.segments.first, :update)

        Rails.cache.fetch(
          "interview-segments-#{allowed_to_see_all ? 'admin' : 'restricted'}-#{interview.id}-#{max_updated_at}"
        ) do
          interview.tapes.inject({}) do |tapes, tape|
            segments_for_tape = tape.segments.
              includes(:interview, :tape, :translations, :registry_references, :user_annotations, annotations: [:translations]).
              order(:timecode)

            tapes[tape.number] = segments_for_tape.inject({}) do |mem, s|
              mem[s.id] = Rails.cache.fetch(
                "segment-#{allowed_to_see_all ? 'admin' : 'restricted'}-#{s.id}-#{s.updated_at}"
              ) do
                raw = SegmentSerializer.new(s, transcript_coupled: transcript_coupled, allowed_to_see_all: allowed_to_see_all)
                JSON.parse(raw.to_json)
              end
              mem
            end
            tapes
          end
        end
      else
        raise Pundit::NotAuthorizedError
      end
    end
  end
end
