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
    file_path = create_tmp_file(file)

    interview = Interview.find_by_archive_id(transcript_params[:archive_id])
    tape = transcript_params[:tape_number] ? interview.tapes.find_by_media_id(
      "#{interview.archive_id}_#{format('%02d', interview.tapes.count)}_#{format('%02d', transcript_params[:tape_number])}"
    ) : interview.tapes.first

    update_tape_durations_and_time_shifts(interview) if transcript_params[:tape_durations]

    create_contributions(interview, transcript_params[:contributions_attributes])
    
    locale = ISO_639.find(Language.find(transcript_params[:transcript_language_id]).code.split(/[\/-]/)[0]).send(Project.alpha) 

    ReadTranscriptFileJob.perform_later(interview, file_path, tape.id, locale, current_user_account, transcript_params[:contributions_attributes].map(&:to_h))

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
        :tape_number,
        :tape_durations,
        :time_shifts,
        contributions_attributes: [:person_id, :contribution_type, :speaker_designation]
    )
  end

  def update_tape_durations_and_time_shifts(interview)
    tape_durations = transcript_params[:tape_durations].split(',').map{|t| Timecode.new(t).time}
    time_shifts = transcript_params[:time_shifts] ? transcript_params[:time_shifts].split(',').map{|t| Timecode.new(t).time} : tape_durations.map{|t| 0}

    tape_durations.each_with_index do |tape_duration, index|
      tape_number = (!transcript_params[:tape_number].blank? && transcript_params[:tape_number].to_i) || index + 1
      tape_media_id = [interview.archive_id, format('%02d', interview.tapes.count), format('%02d', tape_number)].join('_')
      tape = Tape.find_or_create_by media_id: tape_media_id, interview_id: interview.id
      tape.update_attributes duration: tape_duration, time_shift: time_shifts[index]
    end
  end

  def create_contributions(interview, contribution_data)
    contribution_data && contribution_data.each do |c|
      Contribution.create interview_id: interview.id, contribution_type: c['contribution_type'], person_id: c['person_id']
    end
  end


end
