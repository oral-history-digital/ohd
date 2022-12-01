require 'action_dispatch/routing/mapper'

class RegistryNamesController < ApplicationController

  def create
    authorize RegistryName
    registry_name = RegistryName.create(registry_name_params)

    respond_to do |format|
      format.json do
        render json: data_json(registry_name.registry_entry)
      end
    end
  end

  def update
    registry_name = RegistryName.find params[:id]
    authorize registry_name
    registry_name.update registry_name_params

    respond_to do |format|
      format.json do
        render json: data_json(registry_name.registry_entry)
      end
    end
  end

  def destroy 
    registry_name = RegistryName.find params[:id]
    authorize registry_name
    registry_entry = registry_name.registry_entry
    registry_name.destroy

    respond_to do |format|
      format.json do
        render json: data_json(registry_entry)
      end
    end
  end

  private

  def registry_name_params
    params.require(:registry_name).permit(
      :registry_entry_id,
      :registry_name_type_id,
      :name_position,
      translations_attributes: [
        :locale,
        :id, 
        :descriptor
      ]
    )
  end

end
