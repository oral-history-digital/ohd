class InterviewsController < BaseController

  layout 'responsive'

  skip_before_action :authenticate_user_account!, only: :show

  def show
    #LatexToPdf.config.merge! :command => 'xetex', :arguments => ['-etex'], :parse_runs => 2
    @interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "interview-with-segments-#{@interview.id}-#{@interview.updated_at}" do
          segments = Segment.
              #includes(:translations, :annotations => [:translations], registry_references: {registry_entry: {registry_names: :translations} } ).
              includes(:translations, :annotations => [:translations]).#, registry_references: {registry_entry: {registry_names: :translations}, registry_reference_type: {} } ).
          for_interview_id(@interview.id)
          references = @interview.segment_registry_references
          headings = segments.with_heading
          {
              interview: ::InterviewSerializer.new(@interview).as_json,
              segments: segments.map {|s| ::SegmentSerializer.new(s).as_json},
              headings: headings.map {|s| ::SegmentSerializer.new(s).as_json},
              references: references.map {|s| ::RegistryReferenceSerializer.new(s).as_json},
              ref_tree: @interview.ref_tree.select{|r| r[Project.ref_tree_branch_find_attribute] == Project.ref_tree_branch_root_id} # 637018 == id of "Thematic"
              #ref_tree: @interview.ref_tree.select{|r| r[:entry_dedalo_code] == "ts1_1"} # 637018 == id of "Thematic"
              #ref_tree: @interview.ref_tree.select{|r| r[:id] == 138968} # 138968 == id of "Thematic Descriptors"
          }.to_json
        end
        render plain: json
      end
      format.vtt do
        vtt = Rails.cache.fetch "interview-vtt-#{@interview.id}-#{@interview.updated_at}-#{params[:locale]}" do
          @interview.to_vtt(params[:type])
        end
        render plain: vtt
      end
      format.pdf do
        locale = params[:locale]
        letter3_locale = ISO_639.find(locale).send(Project.alpha)
        transcript_type = "translation"
        if @interview.language.code == letter3_locale
          transcript_type = "transcript"
        end
        @language = {locale:letter3_locale, type: transcript_type}
        if params[:kind] == "history"
          pdf = render_to_string(:template => '/latex/history.pdf.erb', :layout => 'latex.pdf.erbtex')
          send_data pdf, filename: "#{@interview.archive_id}_biography_#{locale}.pdf", :type => "application/pdf",
                    :disposition => "attachment"
        elsif params[:kind] == "interview"

          pdf =   render_to_string(:template => '/latex/interview_transcript.pdf.erb', :layout => 'latex.pdf.erbtex')
          send_data pdf, filename: "#{@interview.archive_id}_#{transcript_type}_#{locale}.pdf", :type => "application/pdf",
                    :disposition => "attachment"
        end

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
    style = (params[:filename] || '')[/_[^_]+$/].sub(/^_/, '').to_sym
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
    style = (params[:filename] || '')[/_[^_]+$/].sub(/^_/, '').to_sym
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
    @object ||= @search.results.select {|i| i.archive_id == param}.first unless @search.nil? or @search.results.nil?
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
