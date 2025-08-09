class UserProfilesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user_profile, only: [:show, :edit, :update, :destroy]

  def index
    authorize UserProfile
    @user_profiles = policy_scope(UserProfile).includes(:user, :known_language, :unknown_language)
    @user_profile = current_user.user_profile || current_user.build_user_profile
  end

  def show
    authorize @user_profile
  end

  def new
    @user_profile = current_user.build_user_profile
    authorize @user_profile
    @languages = Language.all.order(:name)
  end

  def create
    @user_profile = current_user.build_user_profile(user_profile_params)
    authorize @user_profile
    @languages = Language.all.order(:name)

    if @user_profile.save
      redirect_to user_profiles_path, notice: 'User profile was successfully created.'
    else
      render :new
    end
  end

  def edit
    authorize @user_profile
    @languages = Language.all.order(:name)
  end

  def update
    authorize @user_profile
    @languages = Language.all.order(:name)
    
    if @user_profile.update(user_profile_params)
      redirect_to user_profiles_path, notice: 'User profile was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    authorize @user_profile
    @user_profile.destroy
    redirect_to user_profiles_path, notice: 'User profile was successfully deleted.'
  end

  private

  def set_user_profile
    if params[:id]
      @user_profile = UserProfile.find(params[:id])
    else
      @user_profile = current_user.user_profile || current_user.build_user_profile
    end
    @languages = Language.all.order(:name)
  end

  def user_profile_params
    params.require(:user_profile).permit(:known_language_id, :unknown_language_id)
  end
end