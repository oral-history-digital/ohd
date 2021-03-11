Rails.application.routes.draw do

  concern :archive do
    get "random_featured_interviews", to: "interviews#random_featured"
    resources :texts

    resources :projects, only: [:create, :update, :destroy]
    get "project/edit-info", to: "projects#edit_info"
    get "project/edit-config", to: "projects#edit_config"
    get "project/edit-display", to: "projects#edit_display"

    resources :languages
    resources :metadata_fields
    resources :external_links
    resources :comments

    resources :contributions, only: [:create, :update, :destroy]
    resources :biographical_entries, only: [:create, :show, :update]
    resources :photos, only: [:create, :update, :destroy]
    resources :uploaded_files, only: [:create, :update, :destroy]
    resources :segments, only: [:create, :update, :index, :destroy, :show]
    resources :registry_entries, only: [:create, :show, :update, :index, :destroy]
    resources :registry_hierarchies, only: [:create, :destroy]
    resources :registry_names, only: [:create, :update, :destroy]
    resources :registry_references, only: [:create, :update, :destroy, :index]
    resources :registry_reference_types, only: [:create, :update, :index, :destroy]
    resources :annotations, only: [:create, :update, :destroy]

    resources :people do
      resources :biographical_entries, only: [:destroy]
      resources :registry_references, only: [:create, :update, :destroy]
    end

    resources :collections do
      collection do
        get :countries
      end
    end

    resources :transcripts, only: [:new, :create]
    resources :uploads, only: [:new, :create]

    get "registry_entry_tree", to: "registry_entries#tree"

    put "update_speakers/:id", to: "interviews#update_speakers"
    put "mark_texts/:id", to: "interviews#mark_texts"
    put "merge_registry_entries/:id", to: "registry_entries#merge"

    resources :interviews do
      member do
        get :doi_contents
        get :metadata
        get 'cmdi-metadata', action: :cmdi_metadata
        get :headings
        get :speaker_designations
        get :ref_tree
      end
      collection do
        post :dois
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

    resources :searches, only: [:new, :facets, :archive, :interview, :map] do
      collection do
        get :facets
        get :archive
        get :export_archive_search
        get :interview
        get :registry_entry
        get :map
      end
    end

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

    resources :user_roles, only: [:create, :destroy]
    resources :roles
    resources :role_permissions, only: [:create, :destroy]
    resources :permissions

    resources :tasks
    resources :task_types
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
    resources :accounts, only: [:show, :update, :index] do
      member do
        get :confirm_new_email
      end
    end
    resources :user_registrations do
      member do
        post :confirm
        get :activate
      end
    end
  end

  # devise_for creates named routes
  # these named routes can NOT be reused in different scopes or constraints
  # but we need them in the routes version with and without :project_id
  #
  concern :unnamed_devise_routes do
    devise_scope :user_account do
      post "user_accounts/sign_in", to: "sessions#create"
      delete "user_accounts/sign_out", to: "sessions#destroy"
      patch "user_accounts/password", to: "passwords#update"
      get "user_accounts/password/edit", to: "passwords#edit"
      put "user_accounts/password", to: "passwords#update"
      post "user_accounts/password", to: "passwords#create"
      get "user_accounts/confirmation", to: "devise/confirmations#show"
      post "user_accounts/confirmation", to: "devise/confirmations#create"
    end
  end

  # these are the routes with :project_id as first part of path
  #
  # for development it is now set to either localhost or ohd.dev
  # in production this should be the ohd-domain
  #
    constraints(lambda { |request| ['localhost:3000', 'da03.cedis.fu-berlin.de:100'].include?("#{request.host}:#{request.port}") }) do
    scope "/:locale" do
      root to: "projects#index"
    end
    scope "/:project_id", :constraints => { project_id: /[a-z]{2,4}/ } do
      root to: redirect {|params, request| project = Project.by_identifier(params[:project_id]); "/#{project.identifier}/#{project.default_locale}"}
      scope "/:locale", :constraints => { locale: /[a-z]{2}/ } do
        root to: "projects#show"
        resources :projects, only: [:update, :destroy]
        concerns :archive
        concerns :account
        concerns :unnamed_devise_routes
      end
    end
  end

  # in development set your projects archive_domain-attribute to sth. you have
  # written into your /etc/hosts (localhost or www.example.com might just be there)
  #
  # in production these are the routes for archiv.zwangsarbeit.de, archive.occupation-memories.org, etc.
  #
  constraints(lambda { |request| Project.archive_domains.include?(request.host) }) do
    root to: redirect {|params, request| "/#{Project.by_host(request.host).default_locale}"}
    scope "/:locale", :constraints => { locale: /[a-z]{2}/ } do
      root to: "projects#show"
      concerns :archive
      concerns :account
      concerns :unnamed_devise_routes
    end
  end

  get "photos/src/:name" => "photos#src"
  get "photos/thumb/:name" => "photos#thumb"

  mount OaiRepository::Engine => "/oai_repository"
  root to: redirect("#{Rails.env.development? ? 'http://localhost:3000/de' : 'http://da03.cedis.fu-berlin.de:100/de'}")

  devise_for :user_accounts,
    controllers: { sessions: "sessions", passwords: "passwords" },
    skip: [:registrations]
end
