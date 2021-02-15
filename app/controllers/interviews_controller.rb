class InterviewsController < ApplicationController
  skip_before_action :authenticate_user_account!, only: [:show, :random_featured]
  skip_after_action :verify_authorized, only: [:show, :metadata, :cmdi_metadata, :random_featured]
  skip_after_action :verify_policy_scoped, only: [:show, :metadata, :cmdi_metadata, :random_featured]

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
    @interview.find_or_create_tapes(interview_params[:tape_count])

    @interview.send("#{params[:interview][:workflow_state]}!") if params[:interview][:workflow_state]

    respond_to do |format|
      format.json do
        render json: data_json(@interview, msg: "processed")
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
    @interview.find_or_create_tapes(interview_params[:tape_count]) if interview_params[:tape_count]

    respond_to do |format|
      format.json do
        render json: {
          archive_id: @interview.archive_id,
          data_type: 'interviews',
          data: JSON.parse(InterviewWithSegmentsSerializer.new(@interview).to_json),
          msg: "processed"
        }
      end
    end
  end

  def mark_texts
    @interview = Interview.find_by_archive_id params[:id]
    authorize @interview

    MarkTextJob.perform_later(@interview, mark_text_params[:texts_attributes].as_json, mark_text_params[:locale], current_user_account)

    respond_to do |format|
      format.json do
        render json: {
          msg: "processing",
          id: @interview.archive_id,
          data_type: "interviews",
          nested_data_type: "mark_text",
          extra_params: "for_interviews_#{params[:id]}",
        }, status: :ok
      end
    end
  end

  def update_speakers
    @interview = Interview.find_by_archive_id params[:id]
    authorize @interview

    # speakers are people designated through column speaker in segment.
    # contributors (update_speakers_params[:contributions]) are people designated through column speaker_id
    #
    contributors = update_speakers_params[:contributions_attributes] && update_speakers_params[:contributions_attributes].map(&:to_h)
    AssignSpeakersJob.perform_later(@interview, speakers, contributors, current_user_account)

    respond_to do |format|
      format.json do
        render json: {
          msg: "processing",
          id: @interview.archive_id,
          data_type: "interviews",
          nested_data_type: "speaker_designations",
        }, status: :ok
      end
    end
  end

  def speaker_designations
    @interview = Interview.find_by_archive_id(params[:id])
    authorize @interview

    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-interview-speaker_designations-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}" do
          {
            data: @interview.speaker_designations,
            nested_data_type: "speaker_designations",
            data_type: "interviews",
            archive_id: params[:id],
            msg: @interview.speaker_designations.empty? ? "second_step_explanation" : "first_step_explanation",
          }
        end.to_json
        render plain: json
      end
    end
  end

  def show
    @interview = Interview.find_by_archive_id(params[:id])
    interview_locale = @interview.alpha3_transcript_locales.first && ISO_639.find(@interview.alpha3_transcript_locales.first).alpha2.to_sym

    respond_to do |format|
      format.json do
        render json: data_json(@interview)
      end
      format.vtt do
        vtt = Rails.cache.fetch "#{current_project.cache_key_prefix}-interview-vtt-#{@interview.id}-#{@interview.updated_at}-#{@interview.segments.maximum(:updated_at)}-#{params[:lang]}-#{params[:tape_number]}" do
          @interview.to_vtt(params[:lang] || interview_locale, params[:tape_number])
        end
        render plain: vtt
      end
      format.pdf do
        @lang = "#{params[:lang]}-public"
        @locale = params[:lang] # change this to params[:locale] if  you want e.g. header and footer in locale
        @lang_human = I18n.t(params[:lang], locale: @locale)
        @orig_lang = "#{interview_locale}-public"
        first_segment_with_heading = @interview.segments.with_heading.first
        @lang_headings_exist = !!first_segment_with_heading && (first_segment_with_heading.mainheading(@lang) || first_segment_with_heading.subheading(@lang))
        pdf = Rails.cache.fetch "#{current_project.cache_key_prefix}-interview-pdf-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}-#{params[:lang]}-#{params[:locale]}" do
          render_to_string(:template => '/latex/interview_transcript.pdf.erb', :layout => 'latex.pdf.erbtex')
        end
        send_data pdf, filename: "#{@interview.archive_id}_transcript_#{params[:lang]}.pdf", :type => "application/pdf"#, :disposition => "attachment"
      end
      format.ods do
        send_data @interview.to_ods(interview_locale, params[:tape_number]), filename: "#{@interview.archive_id}_transcript_#{locale}_tc_tab.ods", type: "application/vnd.oasis.opendocument.spreadsheet" #, :disposition => "attachment"
      end
      format.html
    end
  end

  def destroy
    @interview = Interview.find_by_archive_id(params[:id])
    authorize @interview
    @interview.destroy

    respond_to do |format|
      format.html do
        render action: "index"
      end
      format.json do
        json = {
          archive_id: params[:id],
          data_type: "interviews",
          msg: "deleted",
        }
        render json: json, status: :ok
      end
    end
  end

  def metadata
    @interview = Interview.find_by_archive_id(params[:id])
    @locale = params[:locale]
    respond_to do |format|
      format.xml
    end
  end

  def cmdi_metadata
    interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.xml do
        exporter = InterviewMetadataExporter.new(interview)
        exporter.build
        render xml: exporter.xml
      end
    end
  end

  def dois
    results = {}

    # curl -X POST -H "Content-Type: application/vnd.api+json" --user YOUR_CLIENT_ID:YOUR_PASSWORD -d @my_draft_doi.json https://api.test.datacite.org/dois
    uri = URI.parse(Rails.configuration.datacite["url"])
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    params[:archive_ids].each do |archive_id|
      interview = Interview.find_by_archive_id(archive_id)
      authorize interview

      unless interview.doi_status == "created"
        request = Net::HTTP::Post.new(uri.path, { "Content-Type" => "application/vnd.api+json" })
        request.basic_auth(Rails.configuration.datacite["client_id"], Rails.configuration.datacite["password"])
        request.body = doi_json(archive_id)

        response = http.request(request)

        status = response.code == "201" ? "created" : JSON.parse(response.body)["errors"][0]["title"]
        interview.update_attributes doi_status: status
      else
        status = "created"
      end

      results[archive_id] = status
    end

    respond_to do |format|
      format.json do
        render json: results
      end
    end
  end

  def headings
    @interview = Interview.find_by_archive_id(params[:id])
    authorize @interview
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-interview-headings-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}" do
          segments = @interview.segments.
            includes(:translations, :annotations => [:translations]). #, registry_references: {registry_entry: {registry_names: :translations}, registry_reference_type: {} } ).
            where.not(timecode: "00:00:00.000")
          {
            data: segments.with_heading.map { |s| Rails.cache.fetch("#{current_project.cache_key_prefix}-headings-#{s.id}-#{s.updated_at}") { ::HeadingSerializer.new(s).as_json } },
            nested_data_type: "headings",
            data_type: "interviews",
            archive_id: params[:id],
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
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-interview-ref-tree-#{@interview.id}-#{RegistryEntry.maximum(:updated_at)}" do
          ref_tree = ReferenceTree.new(@interview.segment_registry_references)
          {
            data: ActiveRecord::Base.connection.column_exists?(:registry_entries, :entry_dedalo_code) ? ref_tree.part(RegistryEntry.where(entry_dedalo_code: "ts1_1").first.id) : ref_tree.part(1),
            nested_data_type: "ref_tree",
            data_type: "interviews",
            archive_id: params[:id],
          }
        end.to_json
        render plain: json
      end
    end
  end

  def random_featured
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch("#{current_project.cache_key_prefix}-interview-random-featured", expires_in: 30.minutes) do
          {
            data: Interview.random_featured(6).inject({}){|mem, s| mem[s.archive_id] = cache_single(s); mem},
            data_type: "random_featured_interviews",
          }
        end.to_json
        render plain: json
      end
    end
  end

  def initial_interview_redux_state
    #Rails.cache.fetch("#{current_project.cache_key_prefix}-#{current_user_account ? current_user_account.id : 'logged-out'}-initial-interview-#{@interview.archive_id}-#{@interview.updated_at}") do
    if @interview
      initial_redux_state.update(
        archive: initial_redux_state[:archive].update(
          archiveId: @interview.archive_id,
          interviewEditView: cookies[:interviewEditView]
        ),
        data: initial_redux_state[:data].update(
          interviews: {"#{@interview.identifier}": cache_single(@interview)},
          people: @interview.contributors.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
          statuses: initial_redux_state[:data][:statuses].update(
            interviews: {"#{@interview.identifier}": 'fetched'},
            people: {"contributors_for_interview_#{@interview.id}": 'fetched'}
          )
        )
      )
    else
      initial_redux_state
    end
    #end
  end
  helper_method :initial_interview_redux_state

  private

  def interview_params
    params.require(:interview).
      permit(
      "project_id",
      "collection_id",
      "archive_id",
      "language_id",
      "interview_date",
      "tape_count",
      "duration",
      "video",
      "translated",
      "workflow_state",
      "media_type",
      "biographies_workflow_state",
      properties: {},
      public_attributes: {},
      contributions_attributes: [:person_id, :contribution_type, :speaker_designation],
      translations_attributes: [:locale, :id, :observations, :description]
    )
  end

  def mark_text_params
    params.require(:mark_text).
      permit(
      :locale,
      texts_attributes: [:text_to_mark, :replacement]
    )
  end

  def update_speakers_params
    params.require(:update_speaker).
      permit(
      contributions_attributes: [:person_id, :contribution_type, :speaker_designation],
      speakers: {},
    )
  end

  def speakers
    update_speakers_params[:speakers].to_h
  end

  def doi_json(archive_id)
    @interview = Interview.find_by_archive_id(archive_id)
    @locale = params[:locale]
    xml = render_to_string(template: "/interviews/metadata.xml", layout: false)
    {
      "data": {
        "id": "#{Rails.configuration.datacite["prefix"]}/#{current_project.identifier}.#{archive_id}",
        "type": "dois",
        "attributes": {
          "doi": "#{Rails.configuration.datacite["prefix"]}/#{current_project.identifier}.#{archive_id}",
          "event": "publish",
          "url": "https://www.datacite.org",
          "xml": Base64.encode64(xml),
        },
      },
    }.to_json
  end

  def doi_content(locale, interview)
    template = "/interviews/_doi.#{locale}.html+#{current_project.identifier.to_s}"
    render_to_string(template: template, locals: { interview: interview }, layout: false)
  end
end
