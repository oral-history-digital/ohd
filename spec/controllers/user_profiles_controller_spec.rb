require 'rails_helper'

RSpec.describe UserProfilesController, type: :controller do
  let(:user) { create(:user) }
  let(:language) { create(:language) }
  let(:user_profile) { create(:user_profile, user: user) }

  before do
    sign_in user
  end

  describe "GET #index" do
    it "returns a success response" do
      get :index
      expect(response).to be_successful
    end

    it "assigns user_profiles" do
      user_profile # create the profile
      get :index
      expect(assigns(:user_profiles)).to be_present
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      get :show, params: { id: user_profile.to_param }
      expect(response).to be_successful
    end
  end

  describe "GET #new" do
    it "returns a success response" do
      get :new
      expect(response).to be_successful
    end

    it "assigns a new user_profile" do
      get :new
      expect(assigns(:user_profile)).to be_a_new(UserProfile)
    end
  end

  describe "POST #create" do
    context "with valid parameters" do
      it "creates a new UserProfile" do
        expect {
          post :create, params: { user_profile: { known_language_id: language.id } }
        }.to change(UserProfile, :count).by(1)
      end

      it "redirects to the user_profiles index" do
        post :create, params: { user_profile: { known_language_id: language.id } }
        expect(response).to redirect_to(user_profiles_url)
      end
    end

    context "with invalid parameters" do
      it "does not create a new UserProfile" do
        expect {
          post :create, params: { user_profile: { user_id: nil } }
        }.to change(UserProfile, :count).by(0)
      end
    end
  end

  describe "GET #edit" do
    it "returns a success response" do
      get :edit, params: { id: user_profile.to_param }
      expect(response).to be_successful
    end
  end

  describe "PATCH #update" do
    context "with valid parameters" do
      it "updates the user_profile" do
        patch :update, params: { 
          id: user_profile.to_param, 
          user_profile: { known_language_id: language.id }
        }
        user_profile.reload
        expect(user_profile.known_language_id).to eq(language.id)
      end

      it "redirects to the user_profiles index" do
        patch :update, params: { 
          id: user_profile.to_param, 
          user_profile: { known_language_id: language.id }
        }
        expect(response).to redirect_to(user_profiles_url)
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the user_profile" do
      user_profile # create the profile
      expect {
        delete :destroy, params: { id: user_profile.to_param }
      }.to change(UserProfile, :count).by(-1)
    end

    it "redirects to the user_profiles index" do
      delete :destroy, params: { id: user_profile.to_param }
      expect(response).to redirect_to(user_profiles_url)
    end
  end
end