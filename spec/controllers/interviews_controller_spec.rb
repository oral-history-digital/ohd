require 'rails_helper'

RSpec.describe InterviewsController, type: :controller do
  describe 'GET cmdi_metadata' do
    it 'returns a 200' do
      get :cmdi_metadata, params: { id: 'za283' }

      expect(response).to have_http_status(:ok)
    end
  end
end
