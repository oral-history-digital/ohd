Rails.application.routes.draw do

  get 'hello_world', to: 'hello_world#index'
  resources :people
  root to: "home#archive", locale: :de

  scope "/:locale", :constraints => {:locale => /[a-z]{2}/} do
    devise_for :user_accounts, :controllers => {sessions: 'sessions'}, skip: [:registrations]
    resources :user_registrations do
      member do
        post :confirm
        get :activate
      end
    end

    localized do
      get 'account' => 'accounts#show'

      %w{archive  faq_archive_contents faq_index faq_searching faq_technical map_tutorial}.each do |site|
        get site, to: "home##{site}", as: site
        get '/',  to: "home#archive", as: :home
      end

      get 'map', to: 'registry_references#map', :as => :public_map
      get 'mapframe', to: 'registry_references#map_frame', :as => :map_frame
      get 'locations', to: 'registry_references#locations', :as => :locations

      resources :collections, only: [:show, :index] do
        collection do
          get :countries
        end
      end

      resources :interviews, only: [:show, :index] do
        #member do 
          #get :text_materials
          #get :photos
        #end
        #collection do 
          #get :stills
        #end
        #resources :registry_entries, only: [:show]
        resources :segments, only: [:index]
        resources :tapes do
          collection do
            get :playlist
          end
          member do
            get :transcript
          end
        end
      end

      get 'suche/:suche/:page' => 'searches#query', :as => :search_by_hash_page
      get 'suche/:suche' => 'searches#query', :as => :search_by_hash
      get 'suchen/neu' => 'searches#new', :as => :new_search
      get 'suchen/:page' => 'searches#query', :as => :search_by_page
      get 'suchen' => 'searches#query', :as => :search
      resources :searches do
        collection do
          post :query
          get :interview
          get :person_name
        end
      end

    end

    #get 'arbeitsmappe' => 'user_contents#index'
    #get 'workbook' => 'user_contents#index', :locale => :en
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

    namespace :admin do
      resources :users do
        collection do
          get :admin
        end
        member do
          post :flag
        end
      end
      resources :user_registrations do
        member do
          post :subscribe
          post :unsubscribe
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

  #get 'interviews/:id/text_materials/:filename.:extension' => 'interviews#text_materials', :as => :text_materials
  #get 'interviews/:id/photos/:filename.:extension' => 'interviews#photos', :as => :photos
  #get 'interviews/stills/:filename.:extension' => 'interviews#stills', :as => :stills
  #get 'interviews/:id/in/:registry_entry_id' => 'interviews#show', :as => :interview_registry_entries

  get 'webservice/ortssuche' => 'registry_references#index', :as => :public_locations_search, :format => :js
  get 'webservice/ortssuche.:format' => 'registry_references#index', :as => :public_locations_search_by_format
  get ':locale/webservice/locations/:date.:format' => 'registry_references#full_index', :as => :public_locations_total_pages
  get ':locale/webservice/locations/:date/page.:page.:format' => 'registry_references#full_index', :as => :public_locations_by_page
  #get 'karte' => 'registry_references#map', :as => :public_map
  #get ':locale/map' => 'registry_references#map', :as => :localized_public_map
  #get 'kartenframe' => 'registry_references#map_frame', :as => :map_frame, :locale => :de
  #get ':locale/mapframe' => 'registry_references#map_frame', :as => :localized_map_frame


  #get 'login' => 'sessions#new', :as => :anmelden
  #get 'sign_in' => 'sessions#new', :as => :en_login, :locale => :en
  #get 'passwort_vergessen' => 'passwords#new', :as => :reset_password
  #get 'neues_passwort/:reset_password_token' => 'passwords#edit', :as => :change_password
  #get 'user_accounts' => 'home#index', :as => :devise_for
  #devise_for :user_account
  #get 'en/:page_id' => 'home#show', :locale => :en
  #get 'en/:controller/:action' => '#index', :locale => :en
  #get 'en/:controller/:action/:id' => '#index', :locale => :en
  #get 'en/:controller/:action/:id.:format' => '#index', :locale => :en
  #get 'en' => 'home#show', :locale => :en
  #get ':page_id' => 'home#show', :as => :home
  #get ':locale' => 'home#show', :as => :localized_root
  #get ':locale/:page_id' => 'home#show', :as => :localized_home
  #get '/' => 'home#show'
  get '/:controller(/:action(/:id))'
end
