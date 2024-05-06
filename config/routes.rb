Rails.application.routes.draw do

  use_doorkeeper do
    skip_controllers :authorizations, :applications, :authorized_applications
  end

  scope "/:locale", :constraints => { locale: /[a-z]{2}/ } do
    devise_for :users,
      controllers: {
        sessions: "sessions",
        confirmations: "confirmations",
        passwords: "passwords",
      }
    get "norm_data_api" => "registry_entries#norm_data_api"
    get 'catalog',                  to: 'catalog#index'
    get 'catalog/stats',            to: 'catalog#stats'
    get 'catalog/institutions/:id', to: 'catalog#institution'
    get 'catalog/archives/:id',     to: 'catalog#archive'
    get 'catalog/collections/:id',  to: 'catalog#collection'
  end

  concern :archive do
    get "norm_data_api" => "registry_entries#norm_data_api"
    get "random_featured_interviews", to: "interviews#random_featured"
    resources :texts
    %w(conditions ohd_conditions privacy_protection contact legal_info).each do |page|
      get page, to: "texts#show"
    end

    get "project/edit-info", to: "projects#edit_info"
    get "project/edit-config", to: "projects#edit_config"
    get "project/edit-access-config", to: "projects#edit_access_config"
    get "project/edit-display", to: "projects#edit_display"
    get "project/cmdi_metadata", to: "projects#cmdi_metadata"
    get "project/archiving_batches", to: "projects#archiving_batches_index"
    get "project/archiving_batches/:number", to: "projects#archiving_batches_show"
    resources :access_configs

    get 'metadata-import-template', to: "uploads#metadata_import_template"

    resources :edit_tables, only: [:create, :show]
    resources :languages
    resources :translation_values, except: [:show, :new, :edit]
    get "translations/:id", to: "translation_values#show"
    resources :metadata_fields#, only: [:create, :update, :index]
    resources :external_links#, only: [:create, :update, :index]
    resources :institution_projects
    resources :comments

    resources :contributions, only: [:create, :update, :destroy]
    resources :biographical_entries, only: [:create, :show, :update]
    resources :photos, only: [:create, :update, :destroy]
    resources :logos, only: [:create, :update, :destroy]
    resources :sponsor_logos, only: [:create, :update, :destroy]
    get "media_streams/:archive_id/:tape/:resolution", to: "media_streams#show"
    resources :media_streams, only: [:create, :update, :destroy]
    resources :segments, only: [:create, :update, :index, :destroy, :show]
    resources :registry_entries, only: [:create, :show, :update, :index, :destroy]
    resources :registry_hierarchies, only: [:create, :destroy]
    resources :registry_names, only: [:create, :update, :destroy]
    resources :registry_references, only: [:create, :update, :destroy, :index]
    get "registry_references/for_reg_entry/:id", to: "registry_references#for_reg_entry"
    resources :registry_reference_types, only: [:create, :update, :index, :destroy]
    get "registry_reference_types/global", to: "registry_reference_types#global"
    resources :registry_name_types, only: [:create, :update, :index, :destroy]
    resources :norm_data
    resources :contribution_types, only: [:create, :update, :index, :destroy]
    resources :event_types
    resources :events
    resources :help_texts, only: [:index]
    resources :annotations, only: [:create, :update, :destroy]
    get "locations", to: "registry_references#locations"
    get "location_references", to: "registry_references#location_references"

    resources :people do
      resources :biographical_entries, only: [:destroy]
      resources :registry_references, only: [:create, :update, :destroy]
      resources :events, only: [:index, :show, :create, :update, :destroy]
      get 'landing_page_metadata'
      get 'contributions'
    end

    resources :collections do
      collection do
        get :countries
      end
    end

    resources :transcripts, only: [:new, :create]
    resources :uploads, only: [:new, :create] do
    end

    get "registry_entry_tree", to: "registry_entries#tree"
    get "global_registry_entry_tree", to: "registry_entries#global_tree"

    put "update_speakers/:id", to: "interviews#update_speakers"
    put "mark_texts/:id", to: "interviews#mark_texts"
    put "merge_registry_entries/:id", to: "registry_entries#merge"

    resources :interviews do
      member do
        #get :metadata
        get 'cmdi_metadata', action: :cmdi_metadata
        get :headings
        get :speaker_designations
        get :ref_tree
        get :reload_translations
        get :transcript
        get :observations
        get :export_photos
        get :download_metadata
        get :export_all
        Interview.non_public_method_names.each do |m|
          get m
        end
      end
      collection do
        post :dois
        get :export_metadata
      end
      resources :contributions, only: [:create, :destroy]
      resources :photos, only: [:create, :update, :destroy]
      resources :registry_references, only: [:create, :update, :destroy]
      resources :segments, only: [:create, :update, :index, :destroy]
      resources :tapes do
        collection do
          get :playlist
        end
        member do
          get :transcript
        end
      end
    end

    resources :user_roles, only: [:create, :destroy]
    resources :roles#, only: [:create, :update, :index]
    resources :role_permissions, only: [:create, :destroy]
    resources :permissions

    resources :tasks
    resources :task_types#, only: [:create, :update, :index]
    resources :task_type_permissions, only: [:create, :destroy]

    namespace :admin do
      resources :users do
        collection do
          get :admin
        end
        member do
          post :flag
        end
      end
      resources :user_annotations do
        member do
          post :remove
          post :reject
          post :withdraw
          post :postpone
          post :accept
          post :review
        end
      end
      resources :user_statistics do
        collection do
          get :usage_report
        end
      end
      resources :imports do
        collection do
          get :for_interview
        end
      end
    end
  end

  concern :account do
    resources :users, only: [:update, :index] do
      member do
        get :confirm_new_email
      end
      collection do
        get :current
        get :check_email
        get :access_token
        get :newsletter_recipients
      end
    end
    resources :user_projects, only: [:create, :update]
    resources :user_contents do
      collection do
        get :segment_annotation
        post :create_annotation
        post :sort
      end
      member do
        patch :publish
        get :topics
        post :retract
        put :update_topics
        put :update_annotation
        get :publish_notice
      end
    end
  end

  concern :search do
    resources :searches, only: [:new, :facets, :suggestions, :archive, :interview, :map] do
      collection do
        get :facets
        get :suggestions
        get :archive
        get :export_archive_search
        get :interview
        get :registry_entry
        get :map
        get 'map_references/:id', action: :map_references
        get :map_reference_types
      end
    end
  end

  # devise_for creates named routes
  # these named routes can NOT be reused in different scopes or constraints
  # but we need them in the routes version with and without :project_id
  #
  concern :unnamed_devise_routes do
    devise_scope :user do
      post "users", to: "devise/registrations#create"
      post "users/sign_in", to: "sessions#create"
      get "users/sign_in", to: "sessions#new"
      get "users/is_logged_in", to: "sessions#is_logged_in"
      delete "users/sign_out", to: "sessions#destroy"
      patch "users/password", to: "passwords#update"
      get "users/password/edit", to: "passwords#edit"
      get "users/password/new", to: "passwords#new"
      put "users/password", to: "passwords#update"
      post "users/password", to: "passwords#create"
      get "users/confirmation", to: "confirmations#show"
      post "users/confirmation", to: "confirmations#create"
      put "user_projects/update", to: "user_projects#update"
    end
  end

  concern :basic_project_routes do
    resources :projects, only: [:show, :update, :destroy] do
      member do
        get :contact_email
      end
    end
  end

  concern :all_project_routes do
    resources :projects, only: [:show, :index, :create, :update, :destroy] do
      member do
        get :contact_email
      end
    end
  end

  # these are the routes with :project_id as first part of path
  #
  # for development it is now set to portal.oral-history.localhost:3000
  # you should write portal.oral-history.localhost to your /etc/hosts file
  #
  # in production this should be the ohd-domain
  #
  constraints(lambda { |request| OHD_DOMAIN == request.base_url }) do
    scope "/:locale" do
      get "/", to: "projects#index"
      concerns :all_project_routes
      resources :institutions
      resources :help_texts, only: [:index, :update]
      resources :logos, only: [:create, :update, :destroy]
      concerns :unnamed_devise_routes, :search, :archive
      concerns :account
    end
    scope "/:project_id", :constraints => { project_id: /[\-a-z0-9]{1,11}[a-z]/ } do
      get "/", to: redirect{|params, request|
        project = Project.by_identifier(params[:project_id])
        "/#{project.identifier}/#{project.default_locale}"
      }
      scope "/:locale", :constraints => { locale: /[a-z]{2}/ } do
        get "/", to: "projects#show"
        concerns :basic_project_routes
        resources :institutions
        concerns :archive
        concerns :unnamed_devise_routes, :search
        concerns :account
      end
    end
  end

  # in development set your projects archive_domain-attribute to sth. you have
  # written into your /etc/hosts (localhost or www.example.com might just be there)
  #
  # in production these are the routes for archiv.zwangsarbeit.de, archive.occupation-memories.org, etc.
  #
  constraints(lambda { |request| Project.archive_domains.include?(request.base_url) }) do
    get "/", to: redirect {|params, request| "/#{Project.by_domain(request.base_url).default_locale}"}
    scope "/:locale", :constraints => { locale: /[a-z]{2}/ } do
      get "/", to: "projects#show"
      concerns :basic_project_routes
      resources :institutions
      concerns :archive
      concerns :unnamed_devise_routes, :search
      concerns :account
    end
  end

  get "photos/src/:name" => "photos#src"
  get "photos/thumb/:name" => "photos#thumb"

  get "/de/hls.key" => "media_streams#hls"

  mount OaiRepository::Engine => "/de/oai_repository"
  root to: redirect("#{OHD_DOMAIN}/de")

end
