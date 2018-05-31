class InterviewsController < BaseController

  layout 'responsive'

  skip_before_action :authenticate_user_account!, only: :show

  def new
    #@interview = Interview.create params[:interview]
    respond_to do |format|
      format.html { render :show }
      format.json { render json: :ok }
    end
  end

  def create
    transcript_file = params[:interview].delete(:data)
    @interview = Interview.create interview_params
    @interview.transcript = transcript_file #.path
    respond_to do |format|
      format.json { render json: @interview }
    end
  end

  def edit
    respond_to do |format|
      format.html { render :show }
    end
  end

  def update
    @interview = Interview.find params[:id]
    @interview.update_attributes params[:interview]
    respond_to do |format|
      format.json { render json: @interview }
    end
  end

  def show
    #LatexToPdf.config.merge! :command => 'xetex', :arguments => ['-etex'], :parse_runs => 2
    @interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "interview-with-segments-#{@interview.id}-#{@interview.updated_at}" do
          segments = Segment.
              #includes(:translations, :annotations => [:translations], registry_references: {registry_entry: {registry_names: :translations} } ).
              includes(:translations, :annotations => [:translations]).#, registry_references: {registry_entry: {registry_names: :translations}, registry_reference_type: {} } ).
              for_interview_id(@interview.id).where.not(timecode: '00:00:00.000')
          ref_tree = ReferenceTree.new(@interview.segment_registry_references)
          locales = Project.available_locales.reject{|i| i == 'alias'}
          doi_content = {}
          locales.each do |i|
            I18n.locale = i
            template = "/interviews/_doi.#{i}.html+#{Project.name.to_s}"
            doi_content[i] = render_to_string(template: template, layout: false)
          end
          {
              interview: ::InterviewSerializer.new(@interview).as_json,
              doi_content: doi_content,
              segments: segments.map {|s| ::SegmentSerializer.new(s).as_json},
              headings: segments.with_heading.map {|s| ::SegmentSerializer.new(s).as_json},
              references: @interview.segment_registry_references.map {|s| ::RegistryReferenceSerializer.new(s).as_json},
              ref_tree: ActiveRecord::Base.connection.column_exists?(:registry_entries, :entry_dedalo_code) ? ref_tree.part(RegistryEntry.where(entry_dedalo_code: "ts1_1").first.id) : ref_tree.part(nil)
          }.to_json
        end
        render plain: json
      end
      format.vtt do
        vtt = Rails.cache.fetch "interview-vtt-#{@interview.id}-#{@interview.updated_at}-#{params[:lang]}-#{params[:tape_number]}" do
          @interview.to_vtt(params[:lang], params[:tape_number])
        end
        render plain: vtt
      end
      format.pdf do
        @alpha2_locale = params[:lang]
        @project_locale = ISO_639.find(params[:lang]).send(Project.alpha)
        if params[:kind] == "history"
          pdf = render_to_string(:template => '/latex/history.pdf.erb', :layout => 'latex.pdf.erbtex')
          send_data pdf, filename: "#{@interview.archive_id}_biography_#{params[:lang]}.pdf", :type => "application/pdf", :disposition => "attachment"
        elsif params[:kind] == "interview"
          pdf =   render_to_string(:template => '/latex/interview_transcript.pdf.erb', :layout => 'latex.pdf.erbtex')
          send_data pdf, filename: "#{@interview.archive_id}_transcript_#{@alpha2_locale}.pdf", :type => "application/pdf", :disposition => "attachment"
        end

      end
      format.html
      format.xml
    end
  end

  private

  def interview_params
    params.require(:interview).
      permit(
        'archive_id',
        'language',
        'collection',
        'interview_date',
        'video',
        'translated',
        'published',
        'agreement',
        'appellation',
        'first_name',
        'last_name',
        'middle_names',
        'birth_name',
        'gender',
        'date_of_birth',
    )
  end

end
