require 'exception_notification'

class ApplicationController < ActionController::Base
  include Pundit

  #protect_from_forgery # See ActionController::RequestForgeryProtection for details

  before_action :authenticate_user_account!
  #before_action :set_variant

  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  layout 'responsive'

  def pundit_user
    current_user_account && current_user_account.user
  end

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  prepend_before_action :set_locale
  def set_locale(locale = nil, valid_locales = [])
    locale ||= (params[:locale] || current_project.default_locale).to_sym
    #valid_locales = current_project.available_locales if valid_locales.empty?
    #locale = I18n.default_locale unless valid_locales.include?(locale)
    I18n.locale = locale
  end

  # Append the locale to all requests.
  def default_url_options(options={})
    options.merge({ :locale => I18n.locale })
  end

  def current_project
    #Project.first
    Project.where(shortname: params[:project_id].upcase).first
  end
  helper_method :current_project

  #def set_variant
    #request.variant = current_project.identifier.to_sym
  #end
  
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  append_after_action :set_available_locales
  def set_available_locales
    I18n.available_locales = current_project.available_locales if current_project
  end

  def initial_redux_state
    {
      archive: {
        locale: current_project.default_locale,
        locales: current_project.available_locales,
        projectId: current_project.identifier,
        viewModes: current_project.view_modes,
        viewMode: current_project.view_modes.first,
        listColumns: current_project.list_columns,
        detailViewFields: current_project.detail_view_fields,
        homeContent: home_content,
        editView: false,
        doiResult: {},
        selectedArchiveIds: ['dummy'],
        translations: translations,
        country_keys: country_keys,
        contribution_types: Project.contribution_types,
        languages: Language.all.map { |c| { value: c.id.to_s, name: c.localized_hash, locale: ISO_639.find(c.code.split(/[\/-]/)[0]).alpha2 } },
        media_streams: Project.media_streams,
      },
      account: {
        isLoggingIn: false,
        isLoggedIn: !!current_user_account,
        isLoggedOut: !current_user_account,
        firstName: current_user_account && current_user_account.user.first_name,
        lastName: current_user_account && current_user_account.user.last_name,
        email: current_user_account && current_user_account.user.email,
        admin: current_user_account && current_user_account.user.admin,
      },
      data: {
        statuses: {
          accounts: {current: current_user_account && 'fetched'},
          interviews: {},
          segments: {},
          doi_contents: {},
          headings: {},
          ref_tree: {},
          registry_references: {},
          registry_reference_types: {},
          registry_entries: {},
          contributions: {},
          people: {},
          user_contents: {},
          annotations: {},
          uploads: {},
          biographical_entries: {},
          speaker_designations: {},
          mark_text: {},
          user_registrations: {resultPagesCount: 1},
          roles: {},
          permissions: {},
          tasks: {},
          projects: {all: 'fetched'},
          collections: {"collections_for_project_#{current_project.identifier}": 'fetched'}
        },
        collections: Rails.cache.fetch("#{current_project.cache_key_prefix}-collections-collections_for_project_#{current_project.identifier}-#{Collection.maximum(:updated_at)}") do
          current_project.collections.inject({}){|mem, s| mem[s.id] = cache_single(s); mem}
        end,
        projects: Rails.cache.fetch("projects-#{Project.maximum(:updated_at)}") do 
          Project.all.inject({}){|mem, s| mem[s.id] = cache_single(s); mem}
        end,
        accounts: {
          current: current_user_account && ::UserAccountSerializer.new(current_user_account)
        }
      },
      popup: {
        show: false,
        title: 'bla',
        big: false,
        content: 'bla bla',
        className: 'popup',
        closeOnOverlayClick: true,
        buttons: {
          left: ['cancel'],
          right: ['ok']
        }
      },
      interview: {
        tape: 1,
        videoTime: 0,
        videoStatus: 'pause',
        transcriptTime: 0,
        transcriptScrollEnabled: false,
        resolution: nil,
      },
      search: initial_search_redux_state
    }
  end

  def initial_search_redux_state
    Rails.cache.fetch("#{current_project.cache_key_prefix}-initial-search-#{params}-#{Interview.maximum(:updated_at)}") do
      search = Interview.archive_search(current_user_account, current_project, locale, params)
      dropdown_values = Interview.dropdown_search_values(current_project, current_user_account)
      {
        archive: {
          facets: current_project.updated_search_facets(search),
          query: search_query,
          allInterviewsTitles: dropdown_values[:all_interviews_titles],
          allInterviewsPseudonyms: dropdown_values[:all_interviews_pseudonyms],
          allInterviewsPlacesOfBirth: dropdown_values[:all_interviews_birth_locations],
          foundInterviews: search.results.map{|i| cache_single(i)},
          allInterviewsCount: search.total,
          resultPagesCount: search.results.total_pages,
          resultsCount: search.total,
        },
        interviews: {},
        registryEntries: {
          showRegistryEntriesTree: true,
          results: []
        },
        user_registrations: {
          query: {
            workflow_state: 'unchecked',
            page: 1,
          },
        },
        roles: { query: {page: 1} },
        permissions: { query: {page: 1} },
        projects: { query: {page: 1} }
      }
    end
  end
  helper_method :initial_redux_state

  private

  def search_query
    current_project.search_facets_names.inject({}) do |mem, facet|
      mem["#{facet}[]"] = params[facet] if params[facet]
      mem
    end
  end

  def country_keys
    Rails.cache.fetch("#{current_project.cache_key_prefix}-country-keys") do
      current_project.available_locales.inject({}) do |mem, locale|
        mem[locale] = ISO3166::Country.translations(locale).sort_by { |key, value| value }.to_h.keys
        mem
      end
    end
  end

  def home_content
    Rails.cache.fetch("#{current_project.cache_key_prefix}-home-content") do
      current_project.available_locales.inject({}) do |mem, locale|
        template = "/home/home.#{locale}.html+#{current_project.identifier}"
        mem[locale] = render_to_string(template: template, layout: false)
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
        render :template => '/react/app.html'
      end
      format.json do
        render json: {msg: 'not_authorized'}, status: :ok
      end
    end
  end

  #
  # serialized compiled cache of an instance
  #
  def cache_single(data, name=nil)
    Rails.cache.fetch("#{Project.current.cache_key_prefix}-#{(name || data.class.name).underscore}-#{data.id}-#{data.updated_at}") do
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
    Rails.cache.delete "#{Project.current.cache_key_prefix}-#{ref_object.class.name.underscore}-#{ref_object.id}-#{ref_object.updated_at}"
  end

end
