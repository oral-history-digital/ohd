class InterviewsController < BaseController

  layout 'responsive'

  skip_before_action :authenticate_user_account!, only: :show
  before_action :featured_registry_entry, :only => :show
  skip_before_action :current_search_for_side_panel, :except => :show

  def show
    @interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.json do 
        json = Rails.cache.fetch "interview-#{params[:interview_id]}-#{@interview.updated_at}" do
          segments = Segment.
            includes(:translations, :annotations => [:translations], registry_references: {registry_entry: {registry_names: :translations} } ).
            #includes(:translations, :annotations => [:translations]).#, registry_references: {registry_entry: {registry_names: :translations}, registry_reference_type: {} } ).
            for_interview_id(@interview.id)
          headings = segments.with_heading
          {
            interview: ::InterviewSerializer.new(@interview),
            segments: segments.map{|s| ::SegmentSerializer.new(s)},
            headings: headings.map{|s| ::SegmentSerializer.new(s)},
          }
        end
        render json: json
      end
      format.vtt do
        render text: @interview.to_vtt( params[:type] )
      end
      format.pdf do
        pdf = render_to_string(:template => '/latex/interview_transcript.pdf.erb', :layout => 'latex.pdf.erbtex')
        send_data pdf, filename: "#{@interview.archive_id}_transcript.pdf", :type => "application/pdf",
                  :disposition => "attachment"
      end
      format.html 
    end
  end

  def text_materials
    material = object.text_materials.for_file(params[:filename].capitalize).first
    not_found if material.nil?
    response.headers['Cache-Control'] = 'no-store'
    send_file material.document.path, :disposition => 'inline', :type => material.document.content_type #, :x_sendfile => true
  end

  def photos
    style = (params[:filename] || '')[/_[^_]+$/].sub(/^_/,'').to_sym
    not_found if object.blank?
    photo = object.photos.for_file(params[:filename].capitalize).first
    not_found if photo.nil? or not File.exist?(photo.photo.path(style))
    response.headers['Cache-Control'] = 'no-store'
    send_data File.open(photo.photo.path(style)).read, :filename => photo.photo_file_name, :disposition => 'inline', :type => photo.photo.content_type
  end

  def stills
    archive_id = (params[:filename] || '')[/^\w{2}\d{3}/i].to_s.downcase
    @object = Interview.find_by_archive_id(archive_id)
    not_found if @object.nil?
    style = (params[:filename] || '')[/_[^_]+$/].sub(/^_/,'').to_sym
    image = @object.still_image
    not_found if image.nil? or not File.exist?(image.path(style))
    response.headers['Cache-Control'] = 'private'
    send_data File.open(image.path(style)).read, :filename => @object.still_image_file_name, :disposition => 'inline', :type => image.content_type
  end

  private

  # interviews use *archive_id* instead of id
  # as their parameter - this overrides the
  # resource controller finder for them
  def object
    @object ||= @search.results.select{|i| i.archive_id == param }.first unless @search.nil? or @search.results.nil?
    @object ||= end_of_association_chain.find_by_archive_id(param) unless param.nil?
    @object
  end

  def featured_registry_entry
    @registry_entry = (params[:registry_entry_id].blank? ? nil : RegistryEntry.find(params[:registry_entry_id]))
  end

  def location_to_param(name)
    (name || '').gsub('/', ' ').gsub(/[()-+&.!,;]+/, " ").gsub(/\s+/, "+")
  end

end
