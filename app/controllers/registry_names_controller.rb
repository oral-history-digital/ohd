require 'action_dispatch/routing/mapper'

class RegistryNamesController < ApplicationController
  skip_after_action :verify_authorized, only: [:norm_data]
  skip_after_action :verify_policy_scoped, only: [:norm_data]

  def norm_data
    uri = URI.parse("https://c105-230.cloud.gwdg.de/transformation/api/610819aba6ab26663fe6163d")
    results = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
      request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
      request.body = {expression: params[:expression]}.to_json
      response = http.request request
      response.body
    end


    respond_to do |format|
      format.json do
        render json: JSON.parse(results)["response"]["items"].to_json
      end
    end
  end

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
    registry_name.update_attributes registry_name_params

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
        :descriptor,
        :notes
      ]
    )
  end

end
