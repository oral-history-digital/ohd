class TranscriptsController < ApplicationController
  def new
    authorize :upload, :new?
    respond_to do |format|
      format.html { render 'react/app' }
      format.json { render json: :ok }
    end
  end

  def create
    raise ActiveRecord::RecordNotFound unless current_project

    interview = current_project.interviews.find_by!(archive_id: transcript_params[:archive_id])
    authorize interview, :upload_transcript?
    tape = interview.tapes.find_by!(number: transcript_params[:tape_number])
    file = params.require(:transcript).require(:data)
    unless file.is_a?(ActionDispatch::Http::UploadedFile)
      raise ActionController::BadRequest, 'Expected a transcript file'
    end

    locale = Language.find(transcript_params[:transcript_language_id]).code
    extension = File.extname(file.original_filename).downcase
    file_path = create_transcript_tmp_file(file, extension)
    import_options = {
      filename: file.original_filename,
      delete_existing: transcript_params[:delete_existing],
      frame_rate: transcript_params[:timecode_frame_rate],
      trim_timecodes: transcript_params[:trim_timecodes],
      tape_durations: transcript_params[:tape_durations],
      time_shifts: transcript_params[:time_shifts],
      contributions_attributes: transcript_params[:contributions_attributes]&.to_h
    }

    job_options = {
      interview: interview,
      file_path: file_path,
      tape_id: tape.id,
      locale: locale,
      user: current_user,
      update_only_speakers: transcript_params[:update_only_speakers],
      **import_options
    }

    ReadTranscriptFileJob.perform_later(job_options)

    respond_to do |format|
      format.json do
        render json: {
          msg: "processing",
          id: file.original_filename,
          data_type: 'uploads'
        }, status: :ok
      end
    end
  end

  def destroy
    interview = Interview.find_by_archive_id(params[:interview_id])
    authorize interview, :upload_transcript?
    locale = params[:id]

    Segment::Translation.where(
      segment_id: interview.segments.pluck(:id),
      locale: [locale, "#{locale}-public", "#{locale}-subtitle"]
    ).destroy_all

    interview.segments.with_heading.each do |segment|
      segment.update_has_heading
    end

    interview.reload.touch

    respond_to do |format|
      format.json do
        render json: data_json(interview)
      end
    end
  end

  private

  def transcript_params
    @transcript_params ||= params
      .require(:transcript)
      .permit(
        :archive_id,
        :transcript_language_id,
        :transcript_locale,
        :tape_number,
        :tape_durations,
        :time_shifts,
        :delete_existing,
        :update_only_speakers,
        :timecode_frame_rate,
        :trim_timecodes,
        contributions_attributes: [:id, :person_id, :contribution_type_id, :speaker_designation]
      )
  end

  # Copies an upload to a unique path so queued jobs can share a filename.
  #
  # @param file [ActionDispatch::Http::UploadedFile] Transcript upload
  # @param extension [String] File extension used by the reader
  # @return [String] Path to the closed temporary file
  def create_transcript_tmp_file(file, extension)
    temporary = Tempfile.create(['transcript-', extension], Rails.root.join('tmp'), binmode: true)
    IO.copy_stream(file.tempfile, temporary)
    temporary.path
  ensure
    temporary&.close
  end

end
