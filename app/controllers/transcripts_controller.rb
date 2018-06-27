class TranscriptsController < ApplicationController

  layout 'responsive'

  def new
    respond_to do |format|
      format.html { render 'react/app' }
      format.json { render json: :ok }
    end
  end

  def create
    file = params[:interview].delete(:data)
    file_path = File.join(Rails.root, 'tmp', file.original_filename)
    File.open(file_path, 'wb') {|f| f.write(file.read) }

    if params[:interview].delete(:tape_and_archive_id_from_file)
      archive_id, tape_media_id = extract_archive_id_and_tape_media_id(file)
    else
      archive_id = transcript_params[:archive_id]
      tape_media_id = transcript_params.slice(:archive_id, :tape_count, :tape_number).values.join('_')
    end

    interview = Interview.find_or_create_by collection_id: transcript_params[:collection_id], archive_id: archive_id
    
    tape = Tape.find_or_create_by media_id: tape_media_id, interview_id: interview.id
    interview.update_attributes transcript_params

    column_names = extract_file_column_names(params[:interview])
    ReadTranscriptFileJob.perform_later(interview, file_path, tape.id, column_names: column_names)

    respond_to do |format|
      format.json { render json: 'ok' }
    end
  end

  private

  def transcript_params
    params.require(:interview).
      permit(
        'collection_id',
        'archive_id',
        'language_id',
    )
  end

  def extract_file_column_names(params)
    column_names = params.slice(
      :timecode, 
      :transcript, 
      :translation, 
      :annotations, 
    )
    column_names = column_names.empty? ? {
      timecode: "timecode",
      transcript: "transcript",
      translation: "translation",
      annotation: "annotations",
    } : column_names
  end

  def extract_archive_id_and_tape_media_id(file)
    filename_tokens = (File.basename(file.original_filename, '.ods') || '').split('_')
    archive_id = filename_tokens.first
    tape_media_id = "#{filename_tokens[0]}_#{filename_tokens[1]}_#{filename_tokens[2]}".upcase
    [archive_id, tape_media_id]
  end

end
