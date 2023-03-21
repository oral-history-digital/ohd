class ApplicationController < ActionController::Base
  include Pundit

  #protect_from_forgery # See ActionController::RequestForgeryProtection for details

  #before_action :doorkeeper_authorize!
  before_action :authenticate_user!
  before_action :user_by_token
  def user_by_token
    if doorkeeper_token && !current_user
      user = UserAccount.find(doorkeeper_token.resource_owner_id) 
      sign_in(user)
    end
  end

  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  def pundit_user
    ProjectContext.new(current_user, current_project)
  end

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  prepend_before_action :set_locale
  def set_locale(locale = nil, valid_locales = [])
    locale ||= (params[:locale] || (current_project ? current_project.default_locale : :de)).to_sym
    #valid_locales = current_project.available_locales if valid_locales.empty?
    #locale = I18n.default_locale unless valid_locales.include?(locale)
    I18n.locale = locale
  end

  # Append the locale to all requests.
  def default_url_options(options={})
    options.merge({ :locale => I18n.locale })
  end

  def current_project
    @current_project = @current_project || (
      (params[:project_id].present? && !params[:project_id].is_a?(Array)) ?
        Project.where("UPPER(shortname) = ?", params[:project_id].upcase).first :
        Project.by_host(request.host)
    )
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
        projectId: current_project ? current_project.identifier : nil,
        viewModes: nil,
        viewMode: nil,
        editView: !!cookies["editView"],
        doiResult: {},
        selectedArchiveIds: ['dummy'],
        selectedRegistryEntryIds: ['dummy'],
        translations: translations,
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
      data: {
        statuses: {
          users: {current: 'fetched'},
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
          users: {resultPagesCount: 1},
          roles: {},
          permissions: {},
          tasks: {},
          projects: {all: 'fetched'},
          languages: {all: 'fetched'},
          institutions: {all: 'fetched'},
          collections: {},
          people: {},
          task_types: {},
          registry_reference_types: {},
          registry_name_types: {},
          contribution_types: {},
        },
        projects: Rails.cache.fetch("projects-#{Project.count}-#{Project.maximum(:updated_at)}-#{MetadataField.maximum(:updated_at)}") do
          Project.all.
            includes(:translations, [{metadata_fields: :translations}, {external_links: :translations}]).
            inject({}) { |mem, s| mem[s.id] = cache_single(s); mem }
        end,
        norm_data_providers: Rails.cache.fetch("norm_data_providers-#{NormDataProvider.count}-#{NormDataProvider.maximum(:updated_at)}") do
          NormDataProvider.all.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem }
        end,
        languages: Rails.cache.fetch("languages-#{Language.count}-#{Language.maximum(:updated_at)}") do
          Language.all.includes(:translations).inject({}){|mem, s| mem[s.id] = LanguageSerializer.new(s); mem}
        end,
        institutions: Rails.cache.fetch("institutions-#{Institution.count}-#{Institution.maximum(:updated_at)}") do
          Institution.all.inject({}){|mem, s| mem[s.id] = InstitutionSerializer.new(s); mem}
        end,
        collections: Rails.cache.fetch("collections-#{Collection.maximum(:updated_at)}") do
          Collection.all.inject({}){|mem, s| mem[s.id] = CollectionSerializer.new(s); mem}
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
      search: initial_search_redux_state
    }
  end

  def initial_search_redux_state
    {
      registryEntries: {},
      users: {
        query: {
          'users.workflow_state': 'account_confirmed',
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
      institutions: { query: {page: 1} }
    }
  end
  helper_method :initial_redux_state

  def cache_key_params
    cache_key = ""
    params.reject{|k,v| k == 'controller' || k == 'action'}.each{|k,v| cache_key << "#{k}-#{v}-"}
    cache_key
  end

  private

  def search_query
    if current_project
      current_project.search_facets_names.inject({page: 1}) do |mem, facet|
        mem["#{facet}[]"] = params[facet] if params[facet]
        mem
      end
    else
      {}
    end
  end

  def country_keys
    Rails.cache.fetch('country-keys') do
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = ISO3166::Country.translations(locale).sort_by { |key, value| value }.to_h.keys
        mem
      end
    end
  end

  def translations
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = instance_variable_get("@#{locale}") ||
                    instance_variable_set("@#{locale}",
                                          YAML.load_file(File.join(Rails.root, "config/locales/#{locale}.yml"))[locale.to_s].deep_merge(
                      YAML.load_file(File.join(Rails.root, "config/locales/devise.#{locale}.yml"))[locale.to_s]
                    ).merge(
                      countries: ISO3166::Country.translations(locale),
                    ))
      mem
    end
  end

  def user_not_authorized
    respond_to do |format|
      format.html do
        render :template => '/react/app'
      end
      format.json do
        render json: {msg: 'not_authorized'}, status: :ok
      end
    end
  end

  #
  # serialized compiled cache of an instance
  #
  def cache_single(data, name = nil, related = nil, cache_key_suffix = nil)
    cache_key_prefix = current_project ? current_project.cache_key_prefix : 'ohd'
    Rails.cache.fetch("#{cache_key_prefix}-#{(name || data.class.name).underscore}-#{data.id}-#{data.updated_at}-#{related && data.send(related).updated_at}-#{cache_key_suffix}") do
      raw = "#{name || data.class.name}Serializer".constantize.new(data)
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
      data: cache_single(data)
    }
    json.update(opts)
    json
  end

  def clear_cache(ref_object)
    ref_object.touch
  end

  def create_tmp_file(file)
    dir_path = File.join(Rails.root, 'tmp', 'files')
    Dir.mkdir(dir_path) unless File.exists?(dir_path)
    file_path = File.join(dir_path, file.original_filename)
    File.open(file_path, 'wb') {|f| f.write(file.read) }
    file_path
  end

  def update_contributions(interview, contribution_attributes)
    (contribution_attributes || []).each do |attributes|
      contribution = Contribution.find(attributes[:id])
      contribution.update(speaker_designation: attributes[:speaker_designation])
    end
  end

end
