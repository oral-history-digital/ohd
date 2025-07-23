class PdfsController < ApplicationController
  require 'open-uri'

  def create
    authorize Pdf
    data = params[:pdf].delete(:data)

    adapted_params = pdf_params
    adapted_params[:attachable_id] = adapted_params.delete(:interview_id)
    adapted_params[:attachable_type] = "Interview"

    @pdf = Pdf.create(adapted_params)
    @pdf.file.attach(io: data)

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'interviews',
          id: @pdf.interview.archive_id,
          nested_data_type: 'pdfs',
          nested_id: @pdf.id,
          data: ::PdfSerializer.new(@pdf).as_json
        }
      end
    end
  end

  def update
    @pdf = Pdf.find(params[:id])
    authorize @pdf
    @pdf.update(pdf_params)

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'interviews',
          id: @pdf.interview.archive_id,
          nested_data_type: 'pdfs',
          nested_id: @pdf.id,
          data: ::PdfSerializer.new(@pdf).as_json
        }
      end
    end
  end

  def destroy
    @pdf = Pdf.find(params[:id])
    authorize @pdf
    @pdf.destroy
    clear_cache @pdf.interview

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def pdf_params
    params.require(:pdf).permit(
      :interview_id,
      :workflow_state,
      translations_attributes: [:locale, :id, :title]
    )
  end
end
