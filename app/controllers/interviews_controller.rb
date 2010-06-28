class InterviewsController < BaseController

  layout 'interview', :only => :show

  helper :interview

  actions :show

  def text_materials
    material = object.text_materials.for_file(params[:filename].capitalize).first
    head(:not_found) if material.nil?
    response.headers['Cache-Control'] = 'no-store'
    send_file material.document.path, :disposition => 'inline', :type => material.document.content_type, :x_sendfile => true
  end

  def photos
    style = (params[:filename] || '')[/_[^_]+$/].sub(/^_/,'').to_sym
    photo = object.photos.for_file(params[:filename].capitalize).first
    head(:not_found) if photo.nil?
    response.headers['Cache-Control'] = 'no-store'
    send_data File.open(photo.photo.path(style)).read, :filename => photo.photo_file_name, :disposition => 'inline', :type => photo.photo.content_type
  end

  def stills
    archive_id = (params[:filename] || '')[/^\w{2}\d{3}/i].downcase
    @object = Interview.find_by_archive_id(archive_id)
    head(:not_found) if @object.nil?
    style = (params[:filename] || '')[/_[^_]+$/].sub(/^_/,'').to_sym
    image = @object.still_image
    head(:bad_request) if image.nil?
    response.headers['Cache-Control'] = 'private'
    send_data File.open(image.path(style)).read, :filename => @object.still_image_file_name, :disposition => 'inline', :type => image.content_type
  end

  private

  # interviews use *archive_id* instead of id
  # as their parameter - this overrides the
  # resource controller finder for them
  def object
    @object ||= @search.results.select{|i| i.archive_id == param }.first unless @search.results.nil?
    @object ||= end_of_association_chain.find_by_archive_id(param) unless param.nil?
  end

end