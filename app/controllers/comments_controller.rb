class CommentsController < ApplicationController
  before_action :set_comment, only: [:show, :edit, :update, :destroy]

  def new
    authorize Comment
    respond_to do |format|
      format.html { render "react/app" }
      format.json { render json: {}, status: :ok }
    end
  end

  def create
    authorize Comment
    @comment = Comment.create comment_params
    respond_to do |format|
      format.json do
        render json: data_json(@comment, msg: "processed")
      end
    end
  end

  def update
    @comment = Comment.find params[:id]
    authorize @comment
    @comment.update_attributes comment_params

    respond_to do |format|
      format.json do
        render json: data_json(@comment)
      end
    end
  end

  def show
    @comment = Comment.find params[:id]
    authorize @comment

    respond_to do |format|
      format.json do
        render json: {
          id: @comment.id,
          data_type: 'comments',
          data: params[:with_associations] ? cache_single(@comment, 'CommentWithAssociations') : cache_single(@comment)
        }
      end
    end
  end

  def index
    policy_scope Comment

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        paginate = false
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-comments-#{params}-#{Comment.maximum(:updated_at)}" do
          if params.keys.include?("all")
            data = Comment.all.
              order("created_at ASC").
              inject({}) { |mem, s| mem[s.id] = cache_single(s); mem }
            extra_params = "all"
          elsif params[:comments_for_task]
            data = Comment.
              where(ref_id: params[:comments_for_task], ref_type: 'Task').
              inject({}) { |mem, s| mem[s.id] = cache_single(s); mem }
            extra_params = "comments_for_task#{params[:comments_for_task]}"
          else
            page = params[:page] || 1
            data = Comment.
              paginate(page: page).
              inject({}) { |mem, s| mem[s.id] = cache_single(s); mem }
            paginate = true
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end
          
          {
            data: data,
            data_type: "comments",
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: paginate ? data.total_pages : 1,
          }
        end
        render json: json
      end
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    authorize @comment
    @comment.destroy

    respond_to do |format|
      format.html do
        render :action => "index"
      end
      format.js
      format.json { render json: {}, status: :ok }
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_comment
      @comment = Comment.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def comment_params
      params.fetch(:comment, {}).permit(:author_id, :receiver_id, :ref_id, :ref_type, :text)
    end
end
