class InterviewsController < BaseController

  layout 'interview', :only => :show

  helper :interview

  actions :show

  private

  # interviews use *archive_id* instead of id
  # as their parameter - this overrides the
  # resource controller finder for them
  def object
    @object ||= @search.results.select{|i| i.archive_id == param }.first unless @search.results.nil?
    @object ||= end_of_association_chain.find_by_archive_id(param) unless param.nil?
  end

end