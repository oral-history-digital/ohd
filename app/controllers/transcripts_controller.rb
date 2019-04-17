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
    else
      archive_id = transcript_params[:archive_id]
      tape_media_id = [transcript_params[:archive_id], format('%02d', transcript_params[:tape_count]), format('%02d', transcript_params[:tape_number])].join('_')
    end

    interview = Interview.find_or_create_by archive_id: archive_id
    interview.update_attributes collection_id: transcript_params[:collection_id], language_id: transcript_params[:interview_original_language_id]
    contribution_data = transcript_params[:contributions] ? JSON.parse(transcript_params[:contributions]) :[]
    create_contributions(interview, contribution_data)
    
    tape = Tape.find_or_create_by media_id: tape_media_id, interview_id: interview.id
    locale = ISO_639.find(Language.find(transcript_params[:transcript_language_id]).code).send(Project.alpha) 

    ReadTranscriptFileJob.perform_later(interview, file_path, tape.id, locale, current_user_account, contribution_data)
    #interview.create_or_update_segments_from_vtt(file_path, tape.id, locale, contribution_data)

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
        :collection_id,
        :archive_id,
        :interview_original_language_id,
        :transcript_language_id,
        :tape_count,
        :tape_number,
        :contributions #: [:person_id, :contribution_type, :speaker_designation]
    )
  end

  def extract_archive_id_and_tape_media_id(file)
    filename_tokens = (File.basename(file.original_filename, '.ods') || '').split('_')
    archive_id = filename_tokens.first
    tape_media_id = "#{filename_tokens[0]}_#{filename_tokens[1]}_#{filename_tokens[2]}".upcase
    [archive_id, tape_media_id]
  end

  def create_contributions(interview, contribution_data)
    contribution_data.each do |c|
      Contribution.create interview_id: interview.id, contribution_type: c['contribution_type'], person_id: c['person_id']
    end
  end


end
