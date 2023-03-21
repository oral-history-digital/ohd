class CommentsController < ApplicationController
  before_action :set_comment, only: [:update, :destroy]

  def create
    # ref is the task to comment on 
    ref = comment_params[:ref_type].classify.constantize.find(comment_params[:ref_id])
    authorize ref, :update?
    @comment = Comment.create comment_params
    receiver = @comment.ref.user == current_user ? @comment.ref.supervisor : @comment.ref.user
    @comment.update author_id: current_user.id, receiver_id: receiver && receiver.id
    AdminMailer.with(task: @comment.ref, receiver: receiver, author: current_user, text: @comment.text).new_comment.deliver_now if receiver

    respond_to do |format|
      format.json do
        render json: {
          id: @comment.ref_id,
          data_type: 'tasks',
          data: ::TaskSerializer.new(@comment.ref),
          reload_data_type: 'users',
          reload_id: 'current' 
        } || {}
      end
    end
  end

  def update
    @comment.update(comment_params)

    respond_to do |format|
      format.json do
        #render json: {
          #id: @comment.ref_id,
          #data_type: 'tasks',
          #nested_data_type: 'comments',
          #nested_id: @comment.id,
          #data: cache_single(@comment),
        #}
        render json: {
          id: @comment.ref_id,
          data_type: 'tasks',
          data: ::TaskSerializer.new(@comment.ref),
          reload_data_type: 'users',
          reload_id: 'current' 
        } || {}
      end
    end
  end

  def index
    policy_scope Comment

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        paginate = false
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-comments-#{cache_key_params}-#{Comment.count}-#{Comment.maximum(:updated_at)}" do
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
            result_pages_count: paginate ? data.total_pages : nil,
          }
        end
        render json: json
      end
    end
  end

  def destroy 
    ref = @comment.ref
    @comment.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json do
        render json: {
          id: ref.id,
          data_type: 'tasks',
          data: ::TaskSerializer.new(@comment.ref),
          reload_data_type: 'users',
          reload_id: 'current' 
        } || {}
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_comment
      @comment = Comment.find(params[:id])
      authorize @comment
    end

    # Only allow a trusted parameter "white list" through.
    def comment_params
      params.fetch(:comment, {}).permit(:author_id, :receiver_id, :ref_id, :ref_type, :text)
    end
end
