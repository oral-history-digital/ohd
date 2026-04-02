class ApplicationController < ActionController::Base
  include Pundit::Authorization
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  #protect_from_forgery # See ActionController::RequestForgeryProtection for details

  respond_to :html, :json

  before_action :configure_permitted_parameters, if: :devise_controller?
  #before_action :doorkeeper_authorize!
  before_action :store_user_location!, if: :storable_location?
  before_action :user_by_token
  before_action :check_ohd_session
  before_action :authenticate_user!

  def user_by_token
    if doorkeeper_token && !current_user
      user = User.find(doorkeeper_token.resource_owner_id)
      sign_in(user)
    end
  end

  def check_ohd_session
    if (
        !current_user &&
        request.base_url != OHD_DOMAIN &&
        !params['checked_ohd_session'] &&
        !params[:open_register_popup] &&
        !request.path.end_with?('/register', '/register/') &&
        storable_location?
      )
        project = Project.by_domain(request.base_url)
        return if project.blank?

        path = url_for(
          only_path: true,
          controller: 'sessions',
          action: 'is_logged_in',
          project: project.identifier,
          path: request.fullpath,
        )
        redirect_to "#{OHD_DOMAIN}#{path}"
    end
  end

  after_action :verify_authorized, except: :index, unless: -> { params[:controller] == "devise/registrations" }
  after_action :verify_policy_scoped, only: :index
  after_action if: -> {Rails.env.development?} do
    logger = ActiveRecord::Base.logger

    Rails.logger.info "ActiveRecord: #{logger.query_count} queries performed"
    logger.reset_query_count
  end

  def pundit_user
    ProjectContext.new(current_user, current_project)
  end

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  prepend_before_action :set_locale
  def set_locale(locale = nil, valid_locales = [])
    I18n.locale = locale || params[:locale] || I18n.default_locale
  end

  # Append the locale to all requests.
  def default_url_options(options={})
    options.merge({ :locale => I18n.locale })
  end

  def current_project
    # Memoization: Return if already loaded (even if nil) to prevent duplicate lookups
    return @current_project if defined?(@current_project)
    
    # Determine lookup key (shortname or domain)
    lookup_key = if params[:project_id].present? && !params[:project_id].is_a?(Array)
      [:shortname, params[:project_id]]
    else
      [:archive_domain, request.base_url]
    end
    
    if lookup_key[0] == :archive_domain
      normalized_domain = lookup_key[1].to_s.sub(%r{/+\z}, '')
      lookup_values = [normalized_domain, "#{normalized_domain}/"].uniq
      cache_lookup_value = normalized_domain
    else
      lookup_values = lookup_key[1]
      cache_lookup_value = lookup_key[1]
    end

    # Cache project lookups across requests since projects change infrequently
    cache_key = "project-v2-#{lookup_key[0]}-#{cache_lookup_value}-#{Project.maximum(:updated_at)}"
    
    @current_project = Rails.cache.fetch(cache_key, skip_nil: true) do
      Project.includes(
        :translations,
        :registry_name_types,
        :media_streams,
        :map_sections,
        registry_reference_types: :translations,
        contribution_types: :translations,
        metadata_fields: :translations,
        external_links: :translations,
        # Collections removed - load selectively when needed via CollectionsController
        institution_projects: {institution: :translations},
      ).where(lookup_key[0] => lookup_values).first
    end
  end

  helper_method :current_project

  # Check if there are issues with the current project setup that would prevent the app from functioning properly
  # This is used to display a warning banner on the frontend with instructions on how to fix the issue
  def project_bootstrap_issue
    return @project_bootstrap_issue if defined?(@project_bootstrap_issue)

    if current_project.nil?
      @project_bootstrap_issue = {
        type: :missing_current_project,
        host: request.base_url,
      }
    elsif Project.ohd.nil?
      @project_bootstrap_issue = {
        type: :missing_ohd_project,
        host: request.base_url,
      }
    else
      @project_bootstrap_issue = nil
    end
  end
  helper_method :project_bootstrap_issue

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  # TODO: split this and compose it of smaller parts. E.g. initial_search_redux_state
  def initial_redux_state
    ohd_project = Project.ohd
    on_ohd_portal = current_project&.is_ohd?

    # Determine fetch status for projects based on context
    # to allow frontend to decide what to load lazily
    project_statuses = if on_ohd_portal
      {
        all: 'fetched'
      }
    elsif current_project && ohd_project
      {
        "#{current_project.id}": 'fetched',
        "#{ohd_project.id}": 'fetched',
      }
    elsif current_project
      {
        "#{current_project.id}": 'fetched',
      }
    else
      {}
    end

    projects_data = if on_ohd_portal
      # Cache all projects for OHD portal since they are needed for the startpage and project switching
      Rails.cache.fetch("projects-#{Project.count}-#{Project.maximum(:updated_at)}") do
        Project.all.includes(
          :translations,
          :registry_reference_types,
          :collections,
        ).inject({}) do |mem, s|
          mem[s.id] = cache_single(s, serializer_name: 'ProjectBase')
          mem
        end
      end
    elsif current_project && ohd_project
      {
        "#{current_project.id}": cache_single(current_project),
        "#{ohd_project.id}": cache_single(ohd_project),
      }
    elsif current_project
      {
        "#{current_project.id}": cache_single(current_project),
      }
    else
      {}
    end

    @initial_redux_state ||= {
      archive: {
        locale: I18n.locale,
        projectId: current_project ? current_project.shortname : nil,
        viewModes: nil,
        viewMode: nil,
        editView: !!cookies["editView"],
        translationsView: !!cookies["translationsView"],
        doiResult: {},
        selectedArchiveIds: ['dummy'],
        selectedRegistryEntryIds: ['dummy'],
        translations: TranslationValue.all_for_locale_json(I18n.locale),
        countryKeys: country_keys,
      },
      user: {
        isLoggingIn: false,
        isLoggedIn: !!current_user,
        isLoggedOut: !current_user,
        accessToken: params[:access_token],
        checkedOhdSession: params[:checked_ohd_session],
        firstName: current_user && current_user.first_name,
        lastName: current_user && current_user.last_name,
        email: current_user && current_user.email,
        admin: current_user && current_user.admin,
      },
      'edit-table': {
        columns: cookies["editTableColumns"] ?
          JSON.parse(cookies["editTableColumns"]) :
          %w(
             timecode
             tape_number
             speaker_designation
             transcript
             registry_references
             annotations
          ).to_json,
      },
      data: {
        statuses: {
          users: {current: 'fetched', resultPagesCount: 1},
          interviews: {},
          random_featured_interviews: {},
          segments: {},
          headings: {},
          ref_tree: {},
          registry_references: {},
          registry_entries: {},
          contributions: {},
          user_contents: {},
          annotations: {},
          uploads: {},
          biographical_entries: {},
          speaker_designations: {},
          mark_text: {},
          roles: {},
          permissions: {},
          tasks: {},
          projects: project_statuses,
          collections: {},
          institutions: {},
          languages: {all: 'fetched'},
          translation_values: {},
          people: {},
          task_types: {},
          registry_reference_types: {},
          registry_name_types: {},
          contribution_types: {},
        },
        # Only load current project in initial state
        # Other projects will be lazy-loaded via API when needed
        # This reduces initial page load significantly when many projects exist
        # Exception: On OHD portal, load all projects for the startpage
        projects: projects_data,
        institutions: {},
        collections: {},
        norm_data_providers: Rails.cache.fetch("norm_data_providers-#{NormDataProvider.maximum(:updated_at)}") do
          NormDataProvider.all.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem }
        end,
        languages: Rails.cache.fetch("languages-#{Language.maximum(:updated_at)}") do
          Language.all.includes(:translations).inject({}){|mem, s| mem[s.id] = cache_single(s); mem}
        end,
        users: {
          current: current_user && ::UserSerializer.new(current_user, is_current_user: true) || nil #{}
        },
        registry_entries: {},
        interviews: {},
        segments: {},
      },
      'media-player': {
        tape: 1,
        mediaTime: 0,
        isPlaying: false,
        timeChangeRequest: nil,
      },
      interview: {
        autoScroll: true,
        tabIndex: 0
      },
      search: initial_search_redux_state,
      banner: {
        active: banner_present?,
        edit_mode_only: banner_present? ? current_banner.edit_mode_only : false,
        message_en: banner_present? ? current_banner.message_en : "",
        message_de: banner_present? ? current_banner.message_de : "",
      },
    }
  end

  def initial_search_redux_state
    {
      registryEntries: {},
      users: {
        query: {
          'users.workflow_state': 'afirmed',
          page: 1,
        },
      },
      roles: { query: {page: 1} },
      task_types: { query: {page: 1} },
      permissions: { query: {page: 1} },
      people: { query: {page: 1} },
      registry_reference_types: { query: {page: 1} },
      registry_name_types: { query: {page: 1} },
      contribution_types: { query: {page: 1} },
      projects: { query: {page: 1} },
      collections: { query: {page: 1} },
      languages: { query: {page: 1} },
      translation_values: { query: {page: 1} },
      institutions: { query: {page: 1} }
    }
  end
  helper_method :initial_redux_state

  def cache_key_params
    cache_key = ""
    params.reject{|k,v| k == 'controller' || k == 'action'}.each{|k,v| cache_key << "#{k}-#{v}-"}
    cache_key
  end

  def banner_present?
    current_banner.present?
  end

  def current_banner
    @current_banner ||= Banner.where(active: true)
                               .where("start_date <= ? AND end_date >= ?", Time.current, Time.current)
                               .first
  end

  def tv(key, locale=I18n.locale, replacements={}, fallback_to_key=false)
    TranslationValue.for(key, locale, replacements, fallback_to_key)
  end
  helper_method :tv

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [:otp_attempt])
    devise_parameter_sanitizer.permit(:sign_up) { |u| u.permit(
      :appellation,
      :first_name,
      :last_name,
      :email,
      :street,
      :zipcode,
      :city,
      :country,
      :tos_agreement,
      :priv_agreement,
      :default_locale,
      :pre_register_location,
      :password,
      :password_confirmation,
      :otp_required_for_login,
      :passkey_required_for_login,
    )}
  end

  private

  def country_keys
    Rails.cache.fetch('country-keys-20240624') do
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = ISO3166::Country.translations(locale).sort_by { |key, value| value }.to_h.keys
        mem
      end
    end
  end

  def user_not_authorized
    respond_to do |format|
      format.html do
        render template: '/react/app', status: :forbidden
      end
      format.json do
        render json: {msg: 'not_authorized'}, status: :forbidden
      end
      format.vtt do
        render plain: 'not_authorized', status: :forbidden
      end
      format.csv do
        render text: 'not_authorized', status: :forbidden
      end
      format.pdf do
        render text: 'not_authorized', status: :forbidden
      end
    end
  end

  #
  # serialized compiled cache of an instance
  #
  def cache_single(data, opts={})
    cache_key_prefix = current_project ? current_project.shortname : 'ohd'
    cache_key = "#{cache_key_prefix}-#{(opts[:serializer_name] || data.class.name).underscore}"\
      "-#{data.id}-#{data.updated_at}-#{opts[:related] && data.send(opts[:related]).updated_at}"\
      "-#{opts[:cache_key_suffix]}-#{I18n.locale}"
    Rails.cache.fetch(cache_key) do
      raw = "#{opts[:serializer_name] || data.class.name}Serializer".constantize.new(data, opts)
      # Use as_json instead of JSON.parse(to_json) to avoid unnecessary string conversion
      raw.as_json
    end
  end

  #
  # single instance structure for data-reducer
  #
  def data_json(data, opts={})
    identifier = (data.class.name.underscore == 'interview') ? :archive_id : :id
    json = {
      "#{identifier}": data.send(identifier),
      data_type: data.class.name.underscore.pluralize,
      data: cache_single(data, opts)
    }
    json.update(opts)
    json
  end

  def clear_cache(ref_object)
    ref_object.touch
  end

  def create_tmp_file(file)
    dir_path = File.join(Rails.root, 'tmp', 'files')
    Dir.mkdir(dir_path) unless File.exist?(dir_path)
    file_path = File.join(dir_path, file.original_filename)
    File.open(file_path, 'wb') {|f| f.write(file.read) }
    file_path
  end

  def update_contributions(interview, contribution_attributes)
    (contribution_attributes || []).each do |key, attributes|
      contribution = Contribution.find(attributes[:id])
      contribution.update(speaker_designation: attributes[:speaker_designation])
    end
  end

  def storable_location?
    request.get? && is_navigational_format? && !devise_controller? && !request.xhr?
  end

  def store_user_location!
    store_location_for(:user, request.fullpath)
  end
end
