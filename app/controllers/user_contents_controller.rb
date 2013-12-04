class UserContentsController < BaseController
  include ERB::Util

  layout 'workspace', :except => [ :show, :create ]

  belongs_to :user

  actions :create, :update, :show, :index, :destroy

  before_filter :determine_user!
  skip_before_filter :determine_user

  skip_before_filter :current_search_for_side_panel

  before_filter :authorize_owner!, :only => [ :update, :destroy ]
  rescue_from ActiveRecord::ReadOnlyRecord, :with => :unauthorized_access

  create do
    wants.html do
      render :action => 'show'
    end
    wants.js do
      render :partial => 'show', :object => @object
    end
    failure do
      wants.html do
        render :action => 'show'
      end
      wants.js do
        render :partial => 'show', :object => @object
      end
    end
  end

  destroy do
    wants.html do
      render :action => 'index'
    end
    wants.js do
      render :update do |page|
        page.visual_effect(:switch_off, "user_content_#{@object.id}", { 'afterFinish' => "function(){Element.remove($('user_content_#{@object.id}'));}" })
      end
    end
  end

  create.flash nil

  update.flash nil

  destroy.flash nil

  index do
    wants.html do
    end
    wants.js do
      html = render_to_string :template => '/user_contents/index.html.erb', :layout => false
      render :update do |page|
        page.replace_html 'innerContent', html
        page.visual_effect :fade, 'overlay', :duration => 0.4, :queue => 'end'
      end
    end
  end

  # The show action is used to request info on any existing
  # context-based user_content, or the ability to create a new one (on a 404).
  show do
    wants.html do
      if @object.nil? || @object.new_record?
        render :nothing => true, :status => 404
      else
        render
      end
    end
    wants.js do
      if @object.nil? || @object.new_record?
        render :nothing => true, :status => 404
      else
        render :partial => 'show', :object => @object
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
      @object.user = current_user
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
        respond_to do |format|
          format.html do
            render :partial => 'segment_annotation', :object => @object
          end
          format.js do
            html = render_to_string(:partial => 'segment_annotation', :object => @object)
            render :update do |page|
              page.replace_html :modal_window, html
              page << "setTimeout('$(\"modal_window\").show(); new Effect.Appear(\"modal_window\");', 500);"
              page.show :modal_window
              page.visual_effect :appear, :modal_window
            end
          end
        end
      end
    end
  end

  def update_annotation
    annotation = segment_content('user_annotation')
    annotation_params = params['user_annotation']
    annotation.media_id = annotation_params['media_id']
    annotation.description = annotation_params['description']
    if (workstate = annotation_params['workflow_state']) != annotation.workflow_state
      if workstate == 'private' && !annotation.rejected?
        annotation.retract!
      elsif annotation.private?
        annotation.submit!
      end
    end
    annotation.save
    annotation_response
  end

  update do
    wants.html do
      redirect_to :action => 'show'
    end
    wants.js do
      context = (params['context'] || 'user_content').underscore
      html = render_to_string :partial => context, :object => @object
      render :update do |page|
        page.replace "#{context}_#{object.id}", html
      end
    end
  end

  # render the topics form
  def topics
    object
    respond_to do |format|
      format.html do
        render :partial => 'topics'
      end
      format.js do
        render :layout => false, :partial => 'topics'
      end
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
        item_update = (request.referer =~ /user_contents/) \
          ? render_to_string(:partial => 'user_content', :object => @object) \
          : render_to_string(:partial => 'show', :object => (@user_content = @object))
        # didn't get highlighting to work without messing with background images etc.
        render :update do |page|
          page << "$('modal_window').hide();"
          page.visual_effect(:fade, 'shades', { :from => 0.6 })
          page.replace("user_content_#{@object.id}", item_update)
        end
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
        render :update do |page|
          page.visual_effect(:fade, 'overlay')
        end
      end
    end
  end

  protected

  def unauthorized_access
    render :nothing => true, :status => 403
  end

  private

  # make sure the current_user is the owner of the resource
  def authorize_owner!
    unless object.user == current_user
      raise ActiveRecord::ReadOnlyRecord
    end
  end

  # find the object with the current_user id and the id_hash parameter
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
            klass.find(:first, :conditions => ["user_id = ? AND #{id_attr} = ?", current_user.id, @id_hash ])
          end
        end
      end
    end
    @user_content = @object
  end

  # Retrieves a user_content based on content id or segment media_id
  def segment_content(type='user_content')
    @object ||= begin
      @type = params[:type] || type
      if params[:id].blank?
        # find by media_id
        @media_id = params[:media_id]
        @type.camelize.constantize.for_media_id(@media_id).for_user(current_user).first
      else
        # retrieve by user_content.id
        @type.camelize.constantize.find(:first, :conditions => ['id = ?', params[:id]])
      end
    end
    @object ||= begin
      annotation = UserAnnotation.new
      annotation.user = current_user
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
    @object.user = current_user
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
    if((filters.keys.size > 0) && (filters.keys.size < (current_user.tags.length+1)))
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
    sql_conditions << current_user.id
    includes = []
    tags = tag_filters
    unless tags.empty?
      includes << :taggings
      includes << :tags
      sql_conditions = [ sql_conditions.shift + " AND tags.name IN ('#{tags.map{|t| h(t)}.join("','")}')" ] + sql_conditions
    end
    end_of_association_chain.find(:all, :conditions => sql_conditions, :include => includes, :order => "position ASC, user_contents.created_at DESC")
  end

  def tag_list_from_ids(ids)
    cond = ['id IN (']
    ids.each_with_index do |id,index|
      cond.first << ((index > 0) ? ',?' : '?')
      cond << id
    end
    cond.first << ')'
    Tag.find(:all, :conditions => cond).map(&:name)
  end

  # positional sorting by id list
  def sort_by_list(ids)
    current_contents = UserContent.find(:all, :conditions => ["user_id = ? AND id IN (#{ids.join(',')})", current_user.id], :order => "position ASC, created_at DESC")
    pos = current_contents.map(&:position)
    current_pos = (0.75 * pos.min).round
    pos_per_step = ((1.25 * pos.max - current_pos) / pos.length).floor + 1
    ids.each do |id|
      item = current_contents.select{|c| c.id == id.to_i }.first
      unless item.nil?
        UserContent.update_all ['position = ?', current_pos], "id = #{id} AND user_id = #{current_user.id}"
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
        render :update do |page|
          page << "closeModalWindow(); resumeAfterAnnotation();"
          # inject a user_annotation list element if none exists
          page << <<JS
var annId = 'user_annotation_#{@object.media_id}';
if(!$(annId)) {
  $('user_annotations_list').insert({top: new Element('li', {id: annId}).update('#{@object.id}')});
  // toggle the link to user_content#segment_annotation - doesn't work because it's picking the wrong annotation on clicking this link
  // $(annotationsController.newAnnotationElemID).hide();
  // $(annotationsController.existingAnnotationElemID).show();
}
JS
        end
      end
    end
  end

end
