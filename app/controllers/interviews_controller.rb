class InterviewsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:new, :show, :metadata, :download_metadata, :cmdi_metadata, :random_featured]
  skip_after_action :verify_authorized, only: [:show, :metadata, :download_metadata, :cmdi_metadata, :random_featured]
  skip_after_action :verify_policy_scoped, only: [:show, :metadata, :download_metadata, :cmdi_metadata, :random_featured]

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
    @interview.update interview_params
    @interview.find_or_create_tapes(interview_params[:tape_count]) if interview_params[:tape_count]

    respond_to do |format|
      format.json do
        render json: data_json(
          @interview,
          serializer_name: 'InterviewUpdate',
          changes: (
            params[:interview].keys -
            ["translations_attributes", "public_attributes"]
          ),
          msg: "processed"
        )
      end
    end
  end

  def mark_texts
    @interview = Interview.find_by_archive_id params[:id]
    authorize @interview

    MarkTextJob.perform_later(@interview, mark_text_params[:texts_attributes].as_json, mark_text_params[:locale], current_user)

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
    AssignSpeakersJob.perform_later(@interview, speakers, contributors, current_user)

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
        json = Rails.cache.fetch "#{current_project.shortname}-interview-speaker_designations-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}" do
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

  Interview.non_public_method_names.each do |m|
    define_method m do
      @interview = Interview.find_by_archive_id(params[:id])
      authorize @interview

      if %w(contributions photos registry_references).include?(m)
        association = @interview.send(m)
        data = Rails.cache.fetch("#{@interview.updated_at}-interview-#{m}s-#{@interview.id}-#{association.maximum(:updated_at)}") do
          association.inject({}) { |mem, c| mem[c.id] = cache_single(c); mem }
        end
      else
        data = @interview.localized_hash(m)
      end

      respond_to do |format|
        format.json do
          render json: {
            id: @interview.archive_id,
            data_type: "interviews",
            nested_data_type: m,
            data: data
          }, status: :ok
        end
      end
    end
  end

  def reload_translations
    @interview = Interview.find_by_archive_id(params[:id])
    authorize @interview

    json = {
      id: @interview.archive_id,
      data_type: "interviews",
      nested_data_type: 'translations_attributes',
      data: @interview.translations,
    }

    respond_to do |format|
      format.json do
        render json: json
      end
    end
  end

  def show
    @interview = Interview.find_by_archive_id(params[:id])

    unless @interview.present? && current_project.interviews.include?(@interview)
      raise ActiveRecord::RecordNotFound
    end

    @locale = params[:lang]
    if params[:tape_number]
      trans = @interview.lang == @locale ? 'tr' : 'ue'
      tape_count = format('%02d', @interview.tape_count)
      tape_number = format('%02d', params[:tape_number])
      filename = "#{@interview.archive_id}_#{tape_count}_#{tape_number}_#{trans}_#{params[:lang]}_#{DateTime.now.strftime("%Y_%m_%d")}"
    end

    respond_to do |format|
      format.json do
        render json: data_json(@interview)
      end
      format.vtt do
        unless current_user&.accessible_projects&.include?(current_project) || current_user&.admin?
          raise Pundit::NotAuthorizedError
        end
        vtt = Rails.cache.fetch "#{current_project.shortname}-interview-vtt-#{@interview.id}-#{@interview.updated_at}-#{@locale}-#{params[:tape_number]}" do
          @interview.to_vtt(@locale, params[:tape_number])
        end
        send_data vtt, filename: "#{filename}.vtt", type: "text/vtt"
      end
      format.csv do
        unless current_user&.accessible_projects&.include?(current_project) || current_user&.admin?
          raise Pundit::NotAuthorizedError
        end
        send_data @interview.to_csv(@locale, params[:tape_number]), filename: "#{filename}.csv", type: "text/csv"
      end
      format.html
    end
  end

  def transcript
    interview = Interview.find_by_archive_id(params[:id])
    authorize interview

    respond_to do |format|
      format.pdf do
        send_data(interview.to_pdf(params[:locale], ISO_639.find_by_code(params[:lang]).alpha2),
          filename: "#{interview.archive_id}_transcript_#{params[:lang]}.pdf",
          type: "application/pdf"
        )
      end
    end
  end

  def observations
    interview = Interview.find_by_archive_id(params[:id])
    authorize interview

    respond_to do |format|
      format.pdf do
        send_data interview.observations_pdf(params[:locale], ISO_639.find_by_code(params[:lang]).alpha2), filename: "#{interview.archive_id}_protocol_#{params[:lang]}.pdf", :type => "application/pdf"
      end
      format.json do
        render json: {
          id: interview.archive_id,
          data_type: "interviews",
          nested_data_type: 'observations',
          data: interview.translations.inject({}) { |mem, t| mem[t.locale] = t.observations; mem }
        }, status: :ok
      end
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
    interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.xml do
        render :metadata, locals: {
          interview: interview,
          locale: params[:locale]
        }
      end
    end
  end

  def download_metadata
    interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.xml do
        send_data interview.metadata_xml(params[:locale]), type: "application/xml", filename: "#{params[:id]}_metadata_datacite_#{DateTime.now.strftime("%Y_%m_%d")}.xml"
      end
    end
  end

  def cmdi_metadata
    interview = Interview.find_by_archive_id(params[:id])
    respond_to do |format|
      format.xml do
        exporter = InterviewMetadataExporter.new(interview, params[:batch])
        metadata = exporter.build

        if metadata.valid?
          render xml: metadata.to_xml
        else
          render xml: metadata.errors, status: :unprocessable_entity
        end
      end
    end
  end

  def export_all
    interview = Interview.find_by_archive_id(params[:id])
    authorize interview
    zip = CompleteExport.new(params[:id], current_project).process
    zip.rewind
    respond_to do |format|
      format.zip do
        send_data zip.read, type: "application/zip", filename: "#{params[:id]}_complete_#{DateTime.now.strftime("%Y_%m_%d")}.zip"
      end
    end
  end

  def export_photos
    interview = Interview.find_by_archive_id(params[:id])
    authorize interview
    zip = PhotoExport.new(params[:id], current_project, params[:only_public]).process
    zip.rewind
    respond_to do |format|
      format.zip do
        send_data zip.read, type: "application/zip", filename: "#{params[:id]}_photos_#{!!params[:only_public] ? 'public_' : ''}#{DateTime.now.strftime("%Y_%m_%d")}.zip"
      end
    end
  end

  def export_metadata
    authorize Interview, :download?
    respond_to do |format|
      format.csv do
        send_data MetadataExport.new(params[:archive_ids], current_project, :de).process,
        type: "application/csv",
        filename: "metadata_#{current_project.shortname}_#{DateTime.now.strftime("%Y_%m_%d")}.csv"
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
        interview.update doi_status: status
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
        json = Rails.cache.fetch "#{current_project.shortname}-interview-headings-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}" do
          segments = @interview.segments.
            includes(:translations, :annotations => [:translations]). #, registry_references: {registry_entry: {registry_names: :translations}, registry_reference_type: {} } ).
            where.not(timecode: "00:00:00.000")
          {
            data: segments.with_heading.map { |s| Rails.cache.fetch("#{current_project.shortname}-headings-#{s.id}-#{s.updated_at}") { ::HeadingSerializer.new(s).as_json } },
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
        json = Rails.cache.fetch "#{current_project.shortname}-interview-ref-tree-#{@interview.id}-#{RegistryEntry.maximum(:updated_at)}" do
          ref_tree = ReferenceTree.new(@interview.segment_registry_references)
          ohd_part = ref_tree.part(Project.ohd.root_registry_entry.id)
          project_part = ref_tree.part(current_project.root_registry_entry.id)
          {
            data: { "ohd": ohd_part, "project": project_part },
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
        logged_in = current_user.present?
        serializer_name = logged_in ? 'InterviewLoggedInSearchResult' : 'InterviewBase'
        public_description = current_project.public_description?
        search_results_metadata_fields = current_project.search_results_metadata_fields.
          includes(:translations)
        featured_interviews = current_project.featured_interviews.
          includes(:translations, :registry_references)

        if featured_interviews.present?
          data = featured_interviews.inject({}) do |mem, interview|
            mem[interview.archive_id] = cache_single(
              interview,
              serializer_name: serializer_name,
              public_description: public_description,
              search_results_metadata_fields: search_results_metadata_fields,
              project_available_locales: current_project.available_locales,
              project_shortname: current_project.shortname
            )
            mem
          end
          json = {
            data: data,
            data_type: "random_featured_interviews",
        }.to_json
        else
          json = Rails.cache.fetch("#{current_project.shortname}-interview-random-featured-#{logged_in}", expires_in: 30.minutes) do
            data = Interview.random_featured(6, current_project.id).inject({}) do |mem, interview|
              mem[interview.archive_id] = cache_single(interview, serializer_name: serializer_name)
              mem
            end
            {
              data: data,
              data_type: "random_featured_interviews",
            }
          end.to_json
        end

        render plain: json
      end
    end
  end

  def initial_interview_redux_state
    #Rails.cache.fetch("#{current_project.shortname}-#{current_user ? current_user.id : 'logged-out'}-initial-interview-#{@interview.archive_id}-#{@interview.updated_at}") do
    if @interview
      initial_redux_state.update(
        archive: initial_redux_state[:archive].update(
          archiveId: @interview.archive_id,
          interviewEditView: cookies[:interviewEditView]
        ),
        #data: initial_redux_state[:data].update(
          #interviews: {"#{@interview.identifier}": cache_single(@interview)},
          #statuses: initial_redux_state[:data][:statuses].update(
            #interviews: {"#{@interview.identifier}": 'fetched'},
          #)
        #)
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
      "primary_language_id",
      "secondary_language_id",
      "primary_translation_language_id",
      "interview_date",
      "signature_original",
      "tape_count",
      "transcript_coupled",
      "duration",
      "video",
      "translated",
      "workflow_state",
      "media_type",
      "media_missing",
      "biographies_workflow_state",
      :startpage_position,
      properties: {},
      public_attributes: {},
      contributions_attributes: [:person_id, :contribution_type_id, :speaker_designation],
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
      contributions_attributes: [:person_id, :interview_id, :contribution_type_id, :speaker_designation],
      speakers: {},
    )
  end

  def speakers
    update_speakers_params[:speakers].to_h
  end

  def doi_json(archive_id)
    interview = Interview.find_by_archive_id(archive_id)
    locale = params[:locale]
    xml = render_to_string(
      template: "interviews/metadata",
      layout: false,
      formats: :xml,
      locals: {interview: interview, locale: locale}
    )
    {
      "data": {
        "id": "#{Rails.configuration.datacite["prefix"]}/#{current_project.shortname}.#{archive_id}",
        "type": "dois",
        "attributes": {
          "doi": "#{Rails.configuration.datacite["prefix"]}/#{current_project.shortname}.#{archive_id}",
          "event": "publish",
          "url": "https://www.datacite.org",
          "xml": Base64.encode64(xml),
        },
      },
    }.to_json
  end

end
