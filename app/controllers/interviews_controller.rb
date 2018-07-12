class InterviewsController < BaseController

  layout 'responsive'

  skip_before_action :authenticate_user_account!#, only: :show

  def new
    respond_to do |format|
      format.html { render :show }
      format.json { render json: :ok }
    end
  end

  def create
    @interview = Interview.create interview_params
    respond_to do |format|
      format.json do
        render json: {
          archive_id: @interview.archive_id,
          data_type: 'interviews',
          data: ::InterviewSerializer.new(@interview),
        }
      end
    end
  end

  def edit
    respond_to do |format|
      format.html { render :show }
    end
  end

  def update
    @interview = Interview.find_by_archive_id params[:id]
    @interview.update_attributes interview_params
    respond_to do |format|
      format.json do
        render json: {
          archive_id: @interview.archive_id,
          data_type: 'interviews',
          data: ::InterviewSerializer.new(@interview),
        }
      end
    end
  end

  def show
    #LatexToPdf.config.merge! :command => 'xetex', :arguments => ['-etex'], :parse_runs => 2
    @interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.json do
        render json: cache_interview(@interview)
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

  def doi_contents
    @interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "interview-doi-contents-#{@interview.id}-#{@interview.updated_at}" do
          doi_contents = {}
          locales = Project.available_locales.reject{|i| i == 'alias'}
          locales.each do |i|
            I18n.locale = i
            template = "/interviews/_doi.#{i}.html+#{Project.name.to_s}"
            doi_contents[i] = render_to_string(template: template, layout: false)
          end
          {
            archive_id: params[:id],
            data_type: 'interviews',
            nested_data_type: 'doi_contents',
            data: doi_contents,
          }
        end.to_json
        render plain: json
      end
    end
  end

  def segments
    @interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "interview-segments-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}" do
          {
            data: @interview.tapes.inject({}) do |tapes, t|
              segments_for_tape = Segment.
                includes(:translations, :annotations => [:translations]).
                for_interview_id(@interview.id).
                where(tape_id: t.id).
                where.not(timecode: '00:00:00.000')

              tapes[t.number] = segments_for_tape.inject({}){|mem, s| mem[s.id] = Rails.cache.fetch("segment-#{s.id}-#{s.updated_at}"){::SegmentSerializer.new(s).as_json}; mem}
              tapes
            end,
            nested_data_type: 'segments',
            data_type: 'interviews',
            archive_id: params[:id]
          }
        end.to_json
        render plain: json
      end
    end
  end

  def headings
    @interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "interview-headings-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}" do
          segments = Segment.
              includes(:translations, :annotations => [:translations]).#, registry_references: {registry_entry: {registry_names: :translations}, registry_reference_type: {} } ).
              for_interview_id(@interview.id).where.not(timecode: '00:00:00.000')
          {
            data: segments.with_heading.map {|s| Rails.cache.fetch("headings-#{s.id}-#{s.updated_at}"){::HeadingSerializer.new(s).as_json}},
            nested_data_type: 'headings',
            data_type: 'interviews',
            archive_id: params[:id]
          }
        end.to_json
        render plain: json
      end
    end
  end

  def references
    @interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "interview-references-#{@interview.id}-#{RegistryEntry.maximum(:updated_at)}" do
          {
            data: @interview.segment_registry_references.map {|s| Rails.cache.fetch("registry_reference-#{s.id}-#{s.updated_at}"){::RegistryReferenceSerializer.new(s).as_json}},
            nested_data_type: 'references',
            data_type: 'interviews',
            archive_id: params[:id]
          }
        end.to_json
        render plain: json
      end
    end
  end

  def ref_tree
    @interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "interview-ref-tree-#{@interview.id}-#{RegistryEntry.maximum(:updated_at)}" do
          ref_tree = ReferenceTree.new(@interview.segment_registry_references)
          {
            data: ActiveRecord::Base.connection.column_exists?(:registry_entries, :entry_dedalo_code) ? ref_tree.part(RegistryEntry.where(entry_dedalo_code: "ts1_1").first.id) : ref_tree.part(nil),
            nested_data_type: 'ref_tree',
            data_type: 'interviews',
            archive_id: params[:id]
          }
        end.to_json
        render plain: json
      end
    end
  end

  private

  def interview_params
    params.require(:interviews).
      permit(
        'collection_id',
        'archive_id',
        'language_id',
        'interview_date',
        'video',
        'translated',
    )
  end

end
