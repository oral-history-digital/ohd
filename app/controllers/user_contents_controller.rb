class UserContentsController < BaseController
  include ERB::Util

  #layout 'workspace', :except => [ :show, :create ]

  #before_action :object, except: [:index]
  #before_action :collection, only: [:index]

  #belongs_to :user

  #before_action :determine_user!
  #skip_before_action :determine_user

  #before_action :collection, only: [:index]

  #before_action :authorize_owner!, :only => [ :update, :destroy, :publish, :retract ]
  #rescue_from ActiveRecord::ReadOnlyRecord, :with => :unauthorized_access

  def create
    @user_content = UserContent.new(user_content_params)
    @user_content.user_id = current_user_account.user.id
    @user_content.save
    @user_content.submit! if @user_content.type == 'UserAnnotation' && @user_content.private? && params[:publish]

    respond_to do |format|
      #format.html do
        #render :action => 'show'
      #end
      #format.js do 
        #render :partial => 'show', object: @object
      #end
      format.json do
        render json: {
          data_type: 'user_contents',
          data: ::UserContentSerializer.new(@user_content),
          id: @user_content.id
        }
      end
    end
  end

  def destroy 
    @user_content = UserContent.find(params[:id])
    @user_content.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.js
      format.json { render json: :ok }
    end
  end

  def index 
    user_contents = current_user_account ? UserContent.where(user_id: current_user_account.user.id) : []
    respond_to do |format|
      format.html 
      format.js 
      format.json do
        render json: {
            data: user_contents.inject({}){|mem, s| mem[s.id] = ::UserContentSerializer.new(s).as_json; mem},
            data_type: 'user_contents'
          }
      end
    end
  end

  # The show action is used to request info on any existing
  # context-based user_content, or the ability to create a new one (on a 404).
  def show 
    respond_to do |format|
      format.html do
        if @object.nil? || @object.new_record?
          render body: nil, :status => 404
        end
      end
      format.js do
        if @object.nil? || @object.new_record?
          render json: { status: 404 }
        else
          render :partial => 'show', :object => @object
        end
      end
    end
  end

  # Renders the annotation edit form for annotations
  # to a particular media_id
  def segment_annotation
    segment_content
    respond_to do |format|
      format.html do
        render :partial => 'segment_annotation', :object => @object
      end
      format.js do
        render :partial => 'segment_annotation', :object => @object
      end
    end
  end

  def create_annotation
    annotation_params = params['user_annotation']
    @media_id = annotation_params['media_id']
    segment = Segment.for_media_id(@media_id).scoped({:include => :interview}).first
    unless segment.nil?
      @object = UserAnnotation.new
      @object.user = current_user_account
      @object.reference = segment
      @object.attributes = @object.user_content_attributes
      @object.media_id = @media_id
      @object.translated = annotation_params['translated'] == 'true'
      @object.description = annotation_params['description']
      @object.send(:compile_id_hash)
      if @object.save
        if annotation_params['workflow_state'] != 'private'
          @object.submit!
        end
        annotation_response
      else
        puts "\n\n --- CREATE ANNOTATION FAILED:\n#{@object.inspect}\n\nvalid? - #{@object.valid? ? 'yes' : 'no'}/nERRORS: #{@object.errors.full_messages}-- @@"
        respond_to do |format|
          format.html do
            render :partial => 'segment_annotation', :object => @object
          end
          format.js
        end
      end
    end
  end

  def update_annotation
    annotation = segment_content('user_annotation')
    annotation_params = params['user_annotation']
    annotation.media_id = annotation_params['media_id']
    annotation.description = annotation_params['description']
    annotation.save
    if (workstate = annotation_params['workflow_state']) != annotation.workflow_state
      if workstate == 'private' && !annotation.rejected?
        annotation.retract!
      elsif annotation.private?
        annotation.submit!
      end
    end
    annotation_response
  end

  def publish_notice
    @context = params['context'] # need context for rendering correct response
    respond_to do |format|
      format.html do
        render :partial => 'publish_notice'
      end
      format.js 
    end
  end

  def publish
    object.submit! if object.private?
    respond_to do |format|
      format.html do
        redirect_to user_contents_path
      end
      format.js do
        @partial = params['context'] =~ /user_contents/ ? 'user_content' : 'show'
      end
    end
  end

  def retract
    object.retract! unless object.private?
    item_update_response
  end

  def update
    @user_content = UserContent.find(params[:id])
    @user_content.update_attributes(user_content_params)
    @user_content.submit! if @user_content.type == 'UserAnnotation' && @user_content.private? && params[:publish]

    #@object.update_attributes(user_content_params)
    respond_to do |format|
      #format.html do
        #redirect_to :action => 'show'
      #end
      #format.js do
        #@context = (params['context'] || 'user_content').underscore
        #@att = 'description'
        #@base_id = "#{@context}_#{@object.id}_#{@att}"
      #end
      format.json do
        render json: {status: :ok}
      end
    end
  end

  # render the topics form
  def topics
    object
    @context = params['context'] # need context for rendering correct response
    respond_to do |format|
      format.html do
        render :partial => 'topics'
      end
      format.js 
    end
  end

  # set topics via 'tags' parameter (array of tag names)
  def update_topics
    object
    tag_names = params[:tags] || []
    @object.tag_list = tag_names.is_a?(Array) ? tag_names : []
    @object.save
    respond_to do |format|
      format.html do
        @interview = nil
        if request.referer =~ /interviews/
          @interview = case @object.reference
            when Interview
              @object.reference
            else
              nil
          end
        end
        if @interview.nil?
          redirect_to user_contents_path
        else
          redirect_to interview_path(@interview)
        end
      end
      format.js do
        @partial = (params['context'] =~ /user_contents/) ? 'user_content' : 'show'
      end
    end
  end

  def sort
    sort_by_list params[:user_contents]
    respond_to do |format|
      format.html do
        redirect_to user_contents_path
      end
      format.js do
        render js: "jQuery('#overlay').hide();"
      end
    end
  end

  protected

  def unauthorized_access
    render :nothing => true, :status => 403
  end

  private

  def user_content_params
    properties = params[:user_contents].delete(:properties) if params[:user_contents][:properties]
    params.require(:user_contents).
      permit(:description,
             :title,
             :media_id,
             :interview_references,
             :reference_id, 
             :reference_type, 
             :type,
             :link_url,
             :persistent).
      tap do |whitelisted|
        whitelisted[:properties] = ActionController::Parameters.new(JSON.parse(properties)).permit!
      end
  end

  # make sure the current_user_account is the owner of the resource
  def authorize_owner!
    unless object.user == current_user_account.user
      raise ActiveRecord::ReadOnlyRecord
    end
  end

  # find the object with the current_user_account id and the id_hash parameter
  def object
    @object ||= begin
      @id_hash = params[:id]
      @type = params[:type] || 'user_content'
      unless @type.blank?
        klass = @type.camelize.constantize
        @object = begin
          if @id_hash.blank?
            klass.new
          else
            id_attr = @id_hash.to_i > 0 ? 'id' : 'id_hash'
            klass.where(["user_id = ? AND #{id_attr} = ?", current_user_account.user.id, @id_hash ]).first
          end
        end
      end
    end
    @user_content = @object
  end

  # Retrieves a user_content based on content id or segment media_id
  def segment_content(type='user_content')
    @media_id = params[:media_id]
    @object ||= begin
      @type = params[:type] || type
      if params[:id].blank?
        # find by media_id
        @type.camelize.constantize.for_media_id(@media_id).for_user(current_user_account).first
      else
        # retrieve by user_content.id
        @type.camelize.constantize.where(['id = ?', params[:id]]).first
      end
    end
    @object ||= begin
      annotation = UserAnnotation.new
      annotation.user = current_user_account
      annotation.media_id = @media_id
      annotation.reference = Segment.for_media_id(@media_id).first
      annotation
    end
  end

  def model_name
    @type = params[:type].blank? ? 'user_content' : params[:type].underscore
  end

  def object_params
    @object_params ||= begin
      attributes = {}
      params[model_name].each_pair do |k,v|
        # ensure that only real JSON hash is decoded, not plain attributes
        if k == 'title' || v =~ /^[-,();.\/\w\d\s_]+$/
          attributes[k.to_sym] = v
        else
          a = begin
            ActiveSupport::JSON.decode(v)
          rescue
            v
          end
          attributes[k.to_sym] = a.is_a?(String) ? a.sub(/(\d{2})(-)(\d{2})$/, '\1:\3') : a
        end
      end
      # truncate to length of database columns
      @@content_column_limits ||= UserContent.content_columns.inject({}){|h, c| h[c.name] = c.limit unless c.limit.blank?; h}
      attributes.each do |attr, value|
        if @@content_column_limits.keys.include?(attr.to_s) && value.length > @@content_column_limits[attr.to_s]
          attributes[attr] = @template.truncate(value, :length => @@content_column_limits[attr.to_s])
        end
      end
    end
  end

  def build_object
    @object = model_name.camelize.constantize.new object_params
    @object.user = current_user_account
    @object
  end

  # derives the SQL conditions in Array format from filter params
  def filter_conditions
    conds = []
    values = []
    filters = params['content_filters'] || {}
    types = filters.keys.empty? ? UserContent::CONTENT_TYPES.map{|c| c.to_s.camelize } : []
    filters.keys.each do |content_type|
      next if content_type =~ /^'?_?all_?'?$/
      filter_value = filters[content_type.to_s.underscore].to_i
      types << content_type.to_s.camelize if filter_value != 0
    end
    return [] if types.size == UserContent::CONTENT_TYPES.size
    conds << "type in ('#{types.join("','")}')"
    conditions = [ conds.join(' AND ') ]
    values.each do |value|
      conditions << value
    end
    conditions
  end

  def tag_filters
    filters = params['tag_filters'] || {}
    if((filters.keys.size > 0) && (filters.keys.size < (current_user_account.tags.length+1)))
      return filters.keys
    else
      return []
    end
  end

  def collection
    conditions = filter_conditions
    sql_conditions = []
    sql_conditions << [conditions.shift, 'user_id = ?'].delete_if{|el| el.blank? }.join(' AND ')
    sql_conditions += conditions
    sql_conditions << current_user_account.user.id
    includes = []
    tags = tag_filters
    unless tags.empty?
      includes << :taggings
      includes << :tags
      sql_conditions = [ sql_conditions.shift + " AND tags.name IN ('#{tags.map{|t| h(t)}.join("','")}')" ] + sql_conditions
    end
    @user_contents = UserContent.where(sql_conditions).includes(includes).order("position ASC, user_contents.created_at DESC")
  end

  def tag_list_from_ids(ids)
    cond = ['id IN (']
    ids.each_with_index do |id,index|
      cond.first << ((index > 0) ? ',?' : '?')
      cond << id
    end
    cond.first << ')'
    Tag.where(cond).map(&:name) unless Tag.nil?
  end

  # positional sorting by id list
  def sort_by_list(ids)
    current_contents = UserContent.where(["user_id = ? AND id IN (#{ids.join(',')})", current_user_account.id]).order("position ASC, created_at DESC")
    pos = current_contents.map(&:position)
    current_pos = (0.75 * pos.min).round
    pos_per_step = ((1.25 * pos.max - current_pos) / pos.length).floor + 1
    ids.each do |id|
      item = current_contents.select{|c| c.id == id.to_i }.first
      unless item.nil?
        UserContent.update_all ['position = ?', current_pos], "id = #{id} AND user_id = #{current_user_account.id}"
        item.position = current_pos
      end
      current_pos += pos_per_step
    end
  end

  def annotation_response
    respond_to do |format|
      format.html do
        redirect_to request.referer
      end
      format.js do
        render js: <<JS
          closeModalWindow(); 
          resumeAfterAnnotation();"
          # inject a user_annotation list element if none exists
          var annId = 'user_annotation_#{@object.media_id}';
          if(!$(annId)) {
            $('user_annotations_list').insert({top: new Element('li', {id: annId}).update('#{@object.id}')});
            // toggle the link to user_content#segment_annotation
            $(annotationsController.newAnnotationElemID).hide();
            $(annotationsController.existingAnnotationElemID).show();
            archiveplayer('interview-player').userAnnotationID = #{@object.id};
          }
JS
      end
    end
  end

  def item_update_response
    respond_to do |format|
      format.html do
        redirect_to request.referer
      end
      format.js do
        render :item_update_response
      end
    end
  end

end
