require 'rails_helper'

RSpec.describe InterviewsController, type: :controller do
  login_user_account

  let :interview do
    FactoryBot.create :interview
  end

  describe 'GET cmdi_metadata' do
    it 'returns a 200' do
      get :cmdi_metadata, params: { id: interview.archive_id, locale: :de }, format: :xml

      expect(response).to have_http_status(:ok)
    end
  end
end
