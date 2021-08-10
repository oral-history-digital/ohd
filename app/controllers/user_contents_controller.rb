class UserContentsController < ApplicationController

  def create
    authorize(UserContent)
    @user_content = UserContent.new(user_content_params)
    @user_content.user_account_id = current_user_account.id
    @user_content.project_id = current_project.id
    @user_content.save
    @user_content.submit! if @user_content.type == 'UserAnnotation' && @user_content.private? && params[:publish]
    @user_content.reference.touch if @user_content.type == 'UserAnnotation'

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'user_contents',
          data: ::UserContentSerializer.new(@user_content).as_json,
          id: @user_content.id
        }
      end
    end
  end

  def destroy
    authorize(UserContent)
    @user_content = UserContent.find(params[:id])
    @user_content.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.js
      format.json do
        render json: { id: params[:id] }, status: :ok
      end
    end
  end

  def index
    user_contents = policy_scope(UserContent)

    respond_to do |format|
      format.html
      format.js
      format.json do
        render json: {
            data: user_contents.inject({}){|mem, s| mem[s.id] = ::UserContentSerializer.new(s).as_json; mem},
            data_type: 'user_contents',
          }
      end
    end
  end

  def update
    @user_content = UserContent.find(params[:id])
    authorize @user_content
    @user_content.update_attributes(user_content_params)
    @user_content.submit! if @user_content.type == 'UserAnnotation' && @user_content.private? && params[:publish]

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'user_contents',
          data: ::UserContentSerializer.new(@user_content).as_json,
          id: @user_content.id
        }
      end
    end
  end

  private

  def user_content_params
    params.require(:user_content).
      permit(:description,
             :title,
             :media_id,
             :reference_id,
             :reference_type,
             :type,
             :link_url,
             :workflow_state,
             :shared,
             :persistent,
             properties: [:time, :tape_nbr, :segmentIndex, :interview_archive_id]
      )
  end

end
