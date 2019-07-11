class TranscriptsController < ApplicationController

  layout 'responsive'

  def new
    authorize :upload, :new?
    respond_to do |format|
      format.html { render 'react/app' }
      format.json { render json: :ok }
    end
  end

  def create
    authorize :upload, :create?
    file = params[:transcript].delete(:data)
    file_path = File.join(Rails.root, 'tmp', file.original_filename)
    File.open(file_path, 'wb') {|f| f.write(file.read) }

    if params[:transcript].delete(:tape_and_archive_id_from_file)
      archive_id, tape_media_id = extract_archive_id_and_tape_media_id(file)
      interview = find_or_create_interview(archive_id)
      tape = find_or_create_tape(tape_media_id, interview)
      tape.update_attribute :duration, transcript_params[:tape_durations]
    else
      archive_id = transcript_params[:archive_id].downcase
      interview = find_or_create_interview(archive_id)
      tape = find_or_create_tapes(interview).first
      interview.recalculate_duration!
    end

    contribution_data = transcript_params[:contributions] ? JSON.parse(transcript_params[:contributions]) : []
    create_contributions(interview, contribution_data)
    
    locale = ISO_639.find(Language.find(transcript_params[:transcript_language_id]).code.split(/[\/-]/)[0]).send(Project.alpha) 

    ReadTranscriptFileJob.perform_later(interview, file_path, tape.id, locale, current_user_account, contribution_data)

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

  private

  def transcript_params
    params.require(:transcript).
      permit(
        :archive_id,
        :transcript_language_id,
        :tape_count,
        :tape_number,
        :tape_durations,
        :time_shifts,
        :contributions #: [:person_id, :contribution_type, :speaker_designation]
    )
  end

  def extract_archive_id_and_tape_media_id(file)
    filename_tokens = (File.basename(file.original_filename, File.extname(file.original_filename)) || '').split('_')
    archive_id = filename_tokens.first.downcase
    tape_media_id = "#{filename_tokens[0]}_#{filename_tokens[1]}_#{filename_tokens[2]}".upcase
    [archive_id, tape_media_id]
  end

  def find_or_create_interview(archive_id)
    interview = Interview.where('lower(archive_id) = ?', archive_id.downcase).first 
    interview ||= Interview.create archive_id: archive_id
  end

  def find_or_create_tape(tape_media_id, interview)
    tape = Tape.where('lower(media_id) = ?', tape_media_id).where(interview_id: interview.id).first
    tape || Tape.create(media_id: tape_media_id, interview_id: interview.id)
  end

  def find_or_create_tapes(interview)
    tapes = []
    tape_durations = transcript_params[:tape_durations].split(',').map{|t| Timecode.new(t).time}
    time_shifts = transcript_params[:time_shifts].split(',').map{|t| Timecode.new(t).time}
    tape_count = (!transcript_params[:tape_count].blank? && transcript_params[:tape_count].to_i) || tape_durations.length

    tape_durations.each_with_index do |tape_duration, index|
      tape_number = (!transcript_params[:tape_number].blank? && transcript_params[:tape_number].to_i) || index + 1
      tape_media_id = [interview.archive_id, format('%02d', tape_count), format('%02d', tape_number)].join('_')
      tape = Tape.find_or_create_by media_id: tape_media_id, interview_id: interview.id
      tape.update_attributes duration: tape_duration, time_shift: time_shifts[index]
      tapes << tape
    end
    tapes
  end

  def create_contributions(interview, contribution_data)
    contribution_data.each do |c|
      Contribution.create interview_id: interview.id, contribution_type: c['contribution_type'], person_id: c['person_id']
    end
  end


end
