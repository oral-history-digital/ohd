class TranscriptsController < ApplicationController

  layout 'responsive'

  def new
    respond_to do |format|
      format.html { render 'react/app' }
      format.json { render json: :ok }
    end
  end

  def create
    file = params[:transcript].delete(:data)
    file_path = File.join(Rails.root, 'tmp', file.original_filename)
    File.open(file_path, 'wb') {|f| f.write(file.read) }

    if params[:transcript].delete(:tape_and_archive_id_from_file)
      archive_id, tape_media_id = extract_archive_id_and_tape_media_id(file)
    else
      archive_id = transcript_params[:archive_id]
      tape_media_id = transcript_params.slice(:archive_id, :tape_count, :tape_number).values.join('_')
    end

    interview = Interview.find_or_create_by archive_id: archive_id
    #interview = Interview.find_or_create_by collection_id: transcript_params[:collection_id], archive_id: archive_id
    interview.update_attributes collection_id: transcript_params[:collection_id], language_id: file_column_languages[:transcript]
    
    tape = Tape.find_or_create_by media_id: tape_media_id, interview_id: interview.id

    #interview.create_or_update_segments_from_file(file_path, tape.id, file_column_names, file_column_languages)
    ReadTranscriptFileJob.perform_later(interview, file_path, tape.id, file_column_names, file_column_languages)

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
        file_column_names: [:timecode, :transcript, :translation_one, :translation_two, :annotations],
        file_column_languages: [:transcript, :translation_one, :translation_two],
    )
  end

  def file_column_names
    column_names = transcript_params[:file_column_names].to_h
    column_names || {
      timecode: "timecode",
      transcript: "transcript",
      translation_one: "translation_one",
      translation_two: "translation_two",
      annotation: "annotations",
    } 
  end

  def file_column_languages
    transcript_params[:file_column_languages].to_h
  end

  def extract_archive_id_and_tape_media_id(file)
    filename_tokens = (File.basename(file.original_filename, '.ods') || '').split('_')
    archive_id = filename_tokens.first
    tape_media_id = "#{filename_tokens[0]}_#{filename_tokens[1]}_#{filename_tokens[2]}".upcase
    [archive_id, tape_media_id]
  end

end
