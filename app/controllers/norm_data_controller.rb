class NormDataController < ApplicationController

  def create
    authorize NormDatum
    norm_datum = NormDatum.create(norm_datum_params)

    respond_to do |format|
      format.json do
        render json: data_json(norm_datum.registry_entry)
      end
    end
  end

  def update
    norm_datum = NormDatum.find params[:id]
    authorize norm_datum
    norm_datum.update norm_datum_params

    respond_to do |format|
      format.json do
        render json: data_json(norm_datum.registry_entry)
      end
    end
  end

  def destroy 
    norm_datum = NormDatum.find params[:id]
    authorize norm_datum
    registry_entry = norm_datum.registry_entry
    norm_datum.destroy

    respond_to do |format|
      format.json do
        render json: data_json(registry_entry)
      end
    end
  end

  private

  def norm_datum_params
    params.require(:norm_datum).permit(
      :registry_entry_id,
      :norm_data_provider_id,
      :nid
    )
  end

end
