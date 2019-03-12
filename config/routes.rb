Rails.application.routes.draw do

  root :to => redirect('/de')
  root to: "home#archive", locale: :de

  scope "/:locale", :constraints => {:locale => /[a-z]{2}/} do
    devise_for :user_accounts, :controllers => {sessions: 'sessions', passwords: 'passwords'}, skip: [:registrations]
    resources :accounts, only: [:show, :update] do
      member do
        get :confirm_new_email
      end
    end
    resources :user_registrations do
      member do
        post :confirm
        get :activate
        #post :subscribe
        #post :unsubscribe
      end
    end

    localized do
      resources :contributions, only: [:create, :destroy]
      #resources :histories, only: [:create, :update, :destroy]
      resources :biographical_entries, only: [:create, :show, :update]
      resources :photos, only: [:create, :update, :destroy]
      resources :segments, only: [:create, :update, :index, :destroy, :show]
      resources :registry_entries, only: [:create, :show, :update, :index, :destroy] 
      resources :registry_hierarchies, only: [:create, :destroy]
      resources :registry_references, only: [:create, :update, :destroy, :index]
      resources :registry_reference_types, only: [:create, :update, :index, :destroy]
      resources :annotations, only: [:create, :update, :destroy]
      get 'locations', to: 'registry_references#locations', :as => :locations

      resources :people do
        #resources :histories, only: [:create, :update, :destroy]
        resources :biographical_entries, only: [:destroy]
      end

      %w{archive  faq_archive_contents faq_index faq_searching faq_technical map_tutorial}.each do |site|
        get site, to: "home##{site}", as: site
        get '/',  to: "home#archive", as: :home
      end

      #get 'map', to: 'registry_references#map', :as => :public_map
      #get 'mapframe', to: 'registry_references#map_frame', :as => :map_frame

      resources :collections, only: [:show, :index] do
        collection do
          get :countries
        end
      end

      resources :transcripts, only: [:new, :create]
      resources :uploads, only: [:new, :create]

      #post 'upload_transcript', to: 'interviews#upload_transcript', as: :upload_transcript
      #get 'upload_transcript', to: 'interviews#upload_transcript', as: :upload_transcript

      put 'update_speakers/:id', to: 'interviews#update_speakers'

      resources :interviews do
        member do 
          get :doi_contents
          get :headings
          get :initials
          #get :references
          get :ref_tree
        end
        collection do 
          post :dois
          #get :stills
        end
        #resources :registry_entries, only: [:show]
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

      resources :searches, only: [:new, :facets, :archive, :interview] do
        collection do
          get :facets
          get :archive
          get :export_archive_search
          get :interview
          get :registry_entry
        end
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
     # get 'benutzerstatistik' => 'user_statistics#index', :as => :user_statistics
      resources :imports do
        collection do
          get :for_interview
        end
      end
    end
  end

  get 'photos/src/:name' => 'photos#src'
  get 'photos/thumb/:name' => 'photos#thumb'

end
