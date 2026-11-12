class TranscriptsController < ApplicationController
  def new
    authorize :upload, :new?
    respond_to do |format|
      format.html { render 'react/app' }
      format.json { render json: :ok }
    end
  end

  def create
    file = params[:transcript].delete(:data)
    interview = Interview.find_by_archive_id(transcript_params[:archive_id])
    authorize interview, :upload_transcript?
    tape = interview.tapes.find_by_number transcript_params[:tape_number]

    locale = Language.find(transcript_params[:transcript_language_id]).code
    extension = File.extname(file.original_filename).downcase
    spreadsheet_options = {}

    # Handle spreadsheet uploads
    if TranscriptSpreadsheetImport::EXTENSIONS.include?(extension.delete_prefix('.'))
      tape ||= interview.tapes.find_by!(number: transcript_params[:tape_number])
      file_path = create_spreadsheet_tmp_file(file, extension)
      spreadsheet_options = {
        filename: file.original_filename,
        delete_existing: transcript_params[:delete_existing],
        frame_rate: transcript_params[:timecode_frame_rate],
        trim_timecodes: transcript_params[:trim_timecodes],
        contributions_attributes: transcript_params[:contributions_attributes]&.to_h
      }
    # Handle non-spreadsheet uploads
    else
      file_path = create_tmp_file(file)
      update_tape_durations_and_time_shifts(interview) if transcript_params[:tape_durations]
      tape.segments.destroy_all if transcript_params[:delete_existing]
      update_contributions(interview, transcript_params[:contributions_attributes])
    end

    job_options = {
      interview: interview,
      file_path: file_path,
      tape_id: tape.id,
      locale: locale,
      user: current_user,
      update_only_speakers: transcript_params[:update_only_speakers],
      **spreadsheet_options
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

  # Copies a spreadsheet to a unique path so queued uploads can share a filename.
  #
  # @param file [ActionDispatch::Http::UploadedFile] Spreadsheet upload
  # @param extension [String] File extension used by the spreadsheet reader
  # @return [String] Path to the closed temporary file
  def create_spreadsheet_tmp_file(file, extension)
    temporary = Tempfile.create(['transcript-', extension], Rails.root.join('tmp'), binmode: true)
    IO.copy_stream(file.tempfile, temporary)
    temporary.path
  ensure
    temporary&.close
  end

  def update_tape_durations_and_time_shifts(interview)
    tape_durations = transcript_params[:tape_durations].split(',').map{|t| Timecode.new(t).time}
    time_shifts = transcript_params[:time_shifts] ? transcript_params[:time_shifts].split(',').map{|t| Timecode.new(t).time} : tape_durations.map{|t| 0}

    tape_durations.each_with_index do |tape_duration, index|
      tape_number = (!transcript_params[:tape_number].blank? && transcript_params[:tape_number].to_i) || index + 1
      tape_media_id = [interview.archive_id, format('%02d', interview.tapes.count), format('%02d', tape_number)].join('_')
      tape = Tape.find_or_create_by media_id: tape_media_id, interview_id: interview.id
      tape.update duration: tape_duration, time_shift: time_shifts[index]
    end
  end

end
