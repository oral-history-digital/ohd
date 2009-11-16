class InterviewsController < BaseController

  actions :show

  private

  # interviews use *archive_id* instead of id
  # as their parameter - this overrides the
  # resource controller finder for them
  def object
    @object ||= end_of_association_chain.find_by_archive_id(param) unless param.nil?
  end

end