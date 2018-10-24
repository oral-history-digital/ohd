class InterviewsController < ApplicationController
  include IsoHelpers
  layout 'responsive'

  skip_before_action :authenticate_user_account!#, only: :show

  def new
    authorize Interview
    respond_to do |format|
      format.html { render :show }
      format.json { render json: :ok }
    end
  end

  def create
    authorize Interview
    @interview = Interview.create interview_params
    @interview.send("#{params[:interview][:workflow_state]}!") if params[:interview][:workflow_state]

    respond_to do |format|
      format.json do
        render json: cache_interview(@interview, 'processed')
      end
    end
  end

  def edit
    authorize Interview
    respond_to do |format|
      format.html { render :show }
    end
  end

  def update
    @interview = Interview.find_by_archive_id params[:id]
    authorize @interview
    @interview.update_attributes interview_params

    clear_cache @interview

    respond_to do |format|
      format.json do
        render json: {
          archive_id: @interview.archive_id,
          data_type: 'interviews',
          data: ::InterviewSerializer.new(@interview).as_json,
          #reload_data_type: 'segments',
          #reload_id: "for_interviews_#{@interview.archive_id}"
        }
      end
    end
  end

  def update_speakers
    @interview = Interview.find_by_archive_id params[:id]
    authorize @interview
    AssignSpeakersJob.perform_later(@interview, speakers)

    respond_to do |format|
      format.json do
        render json: {
          msg: "processing_speaker_update",
          id: @interview.archive_id,
          data_type: 'interviews',
          nested_data_type: 'initials'
        }, status: :ok
      end
    end
  end

  def show
    #LatexToPdf.config.merge! :command => 'xetex', :arguments => ['-etex'], :parse_runs => 2
    @interview = Interview.find_by_archive_id(params[:id])
    authorize @interview
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
        @lang = params[:lang].to_sym
        @locale = ISO_639.find(params[:locale]).send(Project.alpha).to_sym
        @orig_lang = projectified(@interview.language.code).to_sym
        pdf =   render_to_string(:template => '/latex/interview_transcript.pdf.erb', :layout => 'latex.pdf.erbtex')
        send_data pdf, filename: "#{@interview.archive_id}_transcript_#{@lang}.pdf", :type => "application/pdf"#, :disposition => "attachment"
      end
      format.html
      format.xml
    end
  end

  def doi_contents
    @interview = Interview.find_by_archive_id(params[:id])
    authorize @interview
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

  def headings
    @interview = Interview.find_by_archive_id(params[:id])
    authorize @interview
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

  def initials
    @interview = Interview.find_by_archive_id(params[:id])
    authorize @interview
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "interview-initials-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}" do
          {
            data: @interview.initials,
            nested_data_type: 'initials',
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
    authorize @interview
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
    params.require(:interview).
      permit(
        'collection_id',
        'archive_id',
        'language_id',
        'interview_date',
        'video',
        'translated',
        'observations',
        'workflow_state'
    )
  end

  def update_speakers_params
    params.require(:update_speaker).
      permit(
        #:split_segments,
        #:cut_initials,
        speakers: {}
    )
  end

  def speakers
    update_speakers_params[:speakers].to_h
  end

end
