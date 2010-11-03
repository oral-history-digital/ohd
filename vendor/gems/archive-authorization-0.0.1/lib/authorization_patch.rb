module AuthorizationPatch
  
  # Authorization Actions are mapping
  # RESTful Controller permissions to
  # CRUD-level actions
  AUTHORIZATION_ACTIONS = {
    :create => :create,
    :show => :read,
    :update => :update,
    :destroy => :delete
  }
  
  module ControllerExtensions
    
    def self.included( recipient )
      recipient.extend( ControllerClassMethods )
      recipient.class_eval do
        before_filter :evaluate_authorization_permissions
        include ControllerInstanceMethods
      end
    end
    
  end
  
  module ControllerClassMethods
    
    # we override the permit class method to
    # store the action authorizations for
    # later checks in a view-context
    #
    # this works together with AuthorizationHelper
    # to provide an abstraction of Controller-Level
    # permissions in the CRUD (Create,Read,Update,
    # Destroy) matrix.
    def permit(authorization_expression, *args)
      
      @authorization_permissions = authorization_permissions
      
      filter_keys = [ :only, :except ]
      filter_args, eval_args = {}, {}
      if args.last.is_a? Hash
        filter_args.merge!( args.last.reject {|k,v| not filter_keys.include? k } )
        eval_args.merge!( args.last.reject {|k,v| filter_keys.include? k } )
      end
      before_filter( filter_args ) do |controller|
        controller.permit( authorization_expression, eval_args )
      end
      # create lambdas for permission checks to be
      # evaluated at request time (as a before_filter)
      actions_for_permission = filter_args[:only] ? filter_args[:only].to_a.map{|a| a.to_sym } & AUTHORIZATION_ACTIONS.keys \
        : AUTHORIZATION_ACTIONS.keys
      actions_for_permission -= filter_args[:except].to_a.map{|a| a.to_sym} if filter_args[:except]
      
      actions_for_permission.each do |action_name|
        @authorization_permissions[AUTHORIZATION_ACTIONS[action_name.to_sym]] = \
          authorization_expression
      end
      
#      # evaluate permissions at runtime / during request
#      before_filter do |controller|
#        controller.evaluate_authorization_permissions
#      end
    end
    
    # accessor for authorization_permissions
    def authorization_permissions
      @authorization_permissions ||= {}
    end
    
  end
  
  module ControllerInstanceMethods
    
    # this is the before_filter that evaluates the
    # permissions at request time
    def evaluate_authorization_permissions
      # we need to set the options here for a permit? / has_permission? check
      @options = { :allow_guests => false, :redirect => false }
      @current_authorizations = {}
      permissions = self.class.authorization_permissions
      AUTHORIZATION_ACTIONS.values.each do |crud_action|
        if permissions.empty?
          # *permit* by default if no authorization permissions were defined
          @current_authorizations[crud_action] = true
        else
          begin
            # *disallow* by default if no authorization is defined
            # for this action
            @current_authorizations[crud_action] = permissions[crud_action].nil? ? false \
            : has_permission?(permissions[crud_action])
          rescue Authorization::AuthorizationExpressionInvalid => e
            # rescue invalid AuthorizationExpressions for collection actions
            # because instance variables cannot be accessed in this context
            # potentially causing valid authorization expressions
            # (defined for other actions) to fail.
            raise e unless action_name == 'index'
            logger.error e.message
          end
        end
      end
    end
    
    # Override this method to make use of Resource Controller
    # in loading model instances
    # Try to find a model to query for permissions
    def get_model( str )
      if str =~ /\s*([A-Z]+\w*)\s*/
        # Handle model class
        begin
          Module.const_get( str )
        rescue
          raise CannotObtainModelClass, "Couldn't find model class: #{str}"
        end
      elsif str =~ /\s*:*(\w+)\s*/
        # Handle model instances
        model_name = $1
        model_symbol = model_name.to_sym
        
        # Resource-Controller loading of objects
        # we need this to correctly retrieve instances
        if defined?(ResourceController::Controller) && self.class.include?(ResourceController::Controller)
          return @object if object.class.name.underscore == model_name
        end
        
        if @options[model_symbol]
          @options[model_symbol]
        elsif instance_variables.include?( '@'+model_name )
          instance_variable_get( '@'+model_name )
        elsif respond_to?(model_symbol)
          send(model_symbol)
        elsif params[:id].blank?
          begin
            model_symbol.to_s.capitalize.constantize.new
          rescue
            ActiveRecord::Base.new
          end
        # Note -- while the following code makes autodiscovery more convenient, it's a little too much side effect & security question
        # elsif self.params[:id]
        #  eval_str = model_name.camelize + ".find(#{self.params[:id]})"
        #  eval eval_str
        else
          raise Authorization::CannotObtainModelObject, "Couldn't find model (#{str}) in hash or as an instance variable"
        end
      end
    end

    private

    # *Override* in order to add context-specific redirection
    # Handle redirection within permit if authorization is denied.
    def handle_redirection
      return if not self.respond_to?( :redirect_to )

      # Store url in session for return if this is available from
      # authentication
      send( STORE_LOCATION_METHOD ) if respond_to? STORE_LOCATION_METHOD
      redirect_url = params[:redirect_url] || ''
      error_msg = ''

      if redirect_url.blank? || redirect_url[/^[^?]*/] == request.url[/^[^?]*/]
        if @current_user && @current_user != :false
          error_msg = @options[:permission_denied_message] || "Sie haben nicht die Berechtigungen um diese Aktion durch zu führen."
          redirect_url = @options[:permission_denied_redirection] || PERMISSION_DENIED_REDIRECTION
        else
          error_msg = @options[:login_required_message] || "Für diese Aktion ist eine Anmeldung erforderlich."
          redirect_url = @options[:login_required_redirection] || LOGIN_REQUIRED_REDIRECTION
        end
      end
      redirect_url.merge!({ :context => params[:context] }) unless params[:context].blank?
      respond_to do |format|
        format.html do
          flash[:error] = error_msg
          redirect_to redirect_url
        end
        format.js do
          render :update do |page|
            page.replace_html 'sys-error', error_msg
            page << "Element.show('sys-error');"
          end
        end
      end
      false  # Want to short-circuit the filters
    end
    
  end
  
end
