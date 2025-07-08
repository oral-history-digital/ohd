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
        storable_location?
      )
        path = url_for(
          only_path: true,
          controller: 'sessions',
          action: 'is_logged_in',
          project: Project.by_domain(request.base_url).identifier,
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
    @current_project = @current_project || (
      (params[:project_id].present? && !params[:project_id].is_a?(Array)) ?
        Project.where(shortname: params[:project_id]) :
        Project.where(archive_domain: request.base_url)
    ).includes(
      :translations,
      :registry_name_types,
      :media_streams,
      :map_sections,
      registry_reference_types: :translations,
      contribution_types: :translations,
      metadata_fields: :translations,
      external_links: :translations,
      collections: :translations,
      #collections: {collection: :translations},
      institution_projects: {institution: :translations},
    ).first
  end

  helper_method :current_project

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  # TODO: split this and compose it of smaller parts. E.g. initial_search_redux_state
  #
  def initial_redux_state
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
        translations: Rails.cache.fetch("translations-#{TranslationValue.maximum(:updated_at)}") do
          TranslationValue.all.includes(:translations).inject({}) do |mem, translation_value|
            mem[translation_value.key] = translation_value.translations.inject({}) do |mem2, translation|
              mem2[translation.locale] = translation.value
              mem2
            end
            mem
          end
        end,
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
          projects: {
            all: 'fetched',
            #"#{current_project.id}": 'fetched'
          },
          #projects: {"#{current_project.id}": 'fetched'},
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
        projects: Rails.cache.fetch("projects-#{Project.count}-#{Project.maximum(:updated_at)}") do
          Project.all.includes(
            :translations,
            :registry_reference_types,
            :collections,
          ).inject({}) do |mem, s|
            mem[s.id] = cache_single(s, serializer_name: 'ProjectBase')
            mem
          end
        end,
        #projects: {
          #"#{current_project.id}": cache_single(current_project),
        #},
        institutions: {},
        collections: {},
        norm_data_providers: Rails.cache.fetch("norm_data_providers-#{NormDataProvider.maximum(:updated_at)}") do
          NormDataProvider.all.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem }
        end,
        languages: Rails.cache.fetch("languages-#{Language.maximum(:updated_at)}") do
          Language.all.includes(:translations).inject({}){|mem, s| mem[s.id] = cache_single(s); mem}
        end,
        users: {
          current: current_user && ::UserSerializer.new(current_user) || nil #{}
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

  protected

  def configure_permitted_parameters
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
      # compile raw-json to string first (making all db-requests!!) using to_json
      # without to_json the lazy serializers wouldn`t do the work to really request the db
      #
      # then parse it back to json
      #
      JSON.parse(raw.to_json)
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
