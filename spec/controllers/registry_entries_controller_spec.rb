require 'rails_helper'

RSpec.describe RegistryEntriesController, type: :controller do
  login_user_account

  let :registry_entry do
    FactoryBot.create :registry_entry
  end

  let :project do
    FactoryBot.create :project
  end

  describe 'GET csv' do
    it 'returns a 200' do
      get :index, params: { root_id: registry_entry.id, lang: :de, locale: :de, project_id: project.shortname }, format: :csv

      expect(response).to have_http_status(:ok)
    end
  end

end
