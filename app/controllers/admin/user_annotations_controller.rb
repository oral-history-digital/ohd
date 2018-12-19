class Admin::UserAnnotationsController < Admin::BaseController

  before_action :collection, only: [:index]
  before_action :get_object, only: [:show, :update, :accept, :reject]

  def index
    policy_scope(UserAnnotation)
    respond_to do |format|
      format.html 
      format.csv do
        response.headers['Pragma'] = 'no-cache'
        response.headers['Cache-Control'] = 'no-cache, must-revalidate'
        response.headers['Content-Type'] = 'text/comma-separated-values'
        fields = %w(author archive_id media_id timecode_string submitted_at workflow_state description link_url)
        csv = [fields.map{|f| translate_field_or_value(f) }.join("\t")]
        @user_annotations.each do |r|
          r_csv = []
          fields.each do |f|
            r_csv << translate_field_or_value(f, r.send(f.to_sym) || '').gsub(/[,;]+/,'')
          end
          csv << r_csv.join("\t")
        end
        send_data(csv.join("\n"),
                  { :filename => "Nutzeranmerkungen-#{@filters.keys.map{|k| translate_field_or_value(k, @filters[k])}.join("_")}-#{Time.now.strftime('%d.%m.%Y')}.csv",
                    :disposition => 'attachment',
                    :type => 'text/comma-separated-values' })
      end
    end
  end

  def show
  end

  # admin#update may only change description (independent of workflow_state!)
  def update
    @object.update_attribute :description, user_annotation_params['description']
    # also update the published annotation object
    unless @object.annotation.nil?
      @object.annotation.update_attribute :text, user_annotation_params['description']
    end
    respond_to do |format|
      format.html
      format.js 
    end
  end

  def accept
    @object.update_attribute(:description, params['description']) unless params['description'].blank?
    @object.accept!
    @flash = 'Nutzeranmerkung veröffentlicht.'
    render_workflow_change
    expire_annotation_cache
  end

  def reject
    @object.update_attribute(:description, params['description']) unless params['description'].blank?
    @object.reject!
    @flash = 'Nutzeranmerkung abgelehnt.'
    render_workflow_change
  end

  def remove
    @object.update_attribute(:description, params['description']) unless params['description'].blank?
    @object.remove!
    @flash = 'Nutzeranmerkung aus dem Archiv entfernt.'
    render_workflow_change
    expire_annotation_cache
  end

  def withdraw
    @object.update_attribute(:description, params['description']) unless params['description'].blank?
    @object.withdraw!
    @flash = 'Nutzeranmerkung aus der Veröffentlichung zurückgezogen.'
    render_workflow_change
    expire_annotation_cache
  end

  def postpone
    @object.update_attribute(:description, params['description']) unless params['description'].blank?
    @object.postpone!
    @flash = 'Veröffentlichung der Nutzeranmerkung zurückgestellt.'
    render_workflow_change
  end

  def review
    @object.update_attribute(:description, params['description']) unless params['description'].blank?
    @object.review!
    @flash = 'Ablehnung der Nutzeranmerkung aufgehoben.'
    render_workflow_change
  end

  def annotation_filter_params
    [:workflow_state, :media_id, :first_name, :last_name, :format]
  end
  helper_method :annotation_filter_params

  private

  def collection
    @filters = {}
    conditionals = []
    condition_args = []
    # workflow state
    @filters['workflow_state'] = params['workflow_state'] || 'proposed'
    unless @filters['workflow_state'].blank? || @filters['workflow_state'] == 'all'
      conditionals << "(workflow_state = '#{@filters['workflow_state']}'" + (@filters['workflow_state'] == "unchecked" ? " OR workflow_state IS NULL)" : ")")
    end
    @filters['workflow_state']
    # user name
    %w(last_name first_name).each do |name_part|
      @filters[name_part] = params[name_part]
      unless @filters[name_part].blank?
        conditionals << "users.#{name_part} LIKE ?"
        condition_args << @filters[name_part] + '%'
      end
    end
    @filters['media_id'] = params['media_id']
    unless @filters['media_id'].blank?
      conditionals << "properties LIKE ?"
      condition_args << "%media_id: #{ActiveRecord::Base.connection.quote(@filters['media_id'].upcase)[1..-2]}%"
    end
    @filters = @filters.delete_if{|k,v| v.blank? || v == 'all' }
    # never show private annotations
    conditionals << "workflow_state != ?"
    condition_args << "private"
    conditions = [ conditionals.join(' AND ') ] + condition_args
    conditions = conditions.first if conditions.length == 1
    @user_annotations = UserAnnotation.joins(:user).where(conditions).order("submitted_at DESC")
  end

  def get_object
    @object = UserAnnotation.find(params[:id])
    authorize @object
  end

  def render_workflow_change
    respond_to do |format|
      format.html do
        flash[:alert] = @flash
        redirect_to admin_user_annotations_path(params)
      end
      format.js do
        render :update
      end
    end
  end

  def expire_annotation_cache
    expire_fragment(fragment_cache_key("annotations_#{@object.archive_id}"))
  end

  def translate_field_or_value(field, value=nil)
    unless value.nil?
      if value.is_a?(Time)
        return value.strftime('%d.%m.%Y %H:%M Uhr')
      end
      if value.blank?
        return ''
      end
      if value == true
        return 'ja'
      end
      value.strip! if value.is_a?(String)
      scope = case field
                when 'author', 'media_id', 'description', 'archive_id', 'timecode_string'
                  return value
                when 'reference'
                  return value.to_s
                when 'link_url'
                  return File.join([request.host_with_port, ApplicationController.relative_url_root, value].compact)
                when 'workflow_state'
                  'user_annotations.workflow_states'
                else
                  'activerecord.attributes.user_annotation.' + field.to_s
              end
      t(value, :scope => scope, :locale => :de)
    else
      t(field, :scope => 'activerecord.attributes.user_annotation', :locale => :de)
    end
  end

  def user_annotation_params
    params.require(:user_annotation).permit(:description)
  end

end
