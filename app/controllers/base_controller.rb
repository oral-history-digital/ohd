class BaseController < ApplicationController #ResourceController::Base

  before_action :authenticate_user_account!

  private

  def cache_interview(interview, msg=nil)
    json = {
      archive_id: interview.archive_id,
      data_type: 'interviews',
      data: ::InterviewSerializer.new(interview).as_json,
    }
    json.update(msg: msg) if msg
    Rails.cache.fetch("interview-#{interview.archive_id}-#{interview.updated_at}"){ json }
  end

  def cache_segment(segment, msg=nil)
    json = {
      id: segment.id,
      data_type: 'segments',
      data: ::SegmentSerializer.new(segment).as_json,
    }
    json.update(msg: msg) if msg
    Rails.cache.fetch("segment-#{segment.id}-#{segment.updated_at}"){ json }
  end

  def clear_cache(ref_object)
    Rails.cache.delete "#{ref_object.class.name.underscore}-#{ref_object.identifier}-#{ref_object.updated_at}"
  end

end
