Archive::Application.routes.draw do

  #root :to => "home#show"
  devise_for :user_accounts

  match ':locale/teilsammlung/:project_id' => 'collections#show', :as => :localized_interview_collection
  match 'teilsammlung/:project_id' => 'collections#show', :as => :interview_collection
  match ':locale/teilsammlungen' => 'collections#index', :as => :localized_interview_collections
  match 'teilsammlungen' => 'collections#index', :as => :interview_collections
  match 'interviews/:id/text_materials/:filename.:extension' => 'interviews#text_materials', :as => :text_materials
  match 'interviews/:id/photos/:filename.:extension' => 'interviews#photos', :as => :photos
  match 'interviews/stills/:filename.:extension' => 'interviews#stills', :as => :stills
  match 'interviews/:id/in/:registry_entry_id' => 'interviews#show', :as => :interview_registry_entries
  resources :interviews do


    resources :tapes do
      collection do
        get :playlist
      end
      member do
        get :transcript
      end

    end
  end

  match 'webservice/ortssuche' => 'registry_references#index', :as => :public_locations_search, :format => :js
  match 'webservice/ortssuche.:format' => 'registry_references#index', :as => :public_locations_search_by_format
  match ':locale/webservice/locations/:date.:format' => 'registry_references#full_index', :as => :public_locations_total_pages
  match ':locale/webservice/locations/:date/page.:page.:format' => 'registry_references#full_index', :as => :public_locations_by_page
  match 'karte' => 'registry_references#map', :as => :public_map
  match ':locale/map' => 'registry_references#map', :as => :localized_public_map
  match 'kartenframe' => 'registry_references#map_frame', :as => :map_frame, :locale => :de
  match ':locale/mapframe' => 'registry_references#map_frame', :as => :localized_map_frame
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
    match 'benutzerverwaltung' => 'user_registrations#index', :as => :user_management
    match 'benutzerverwaltung.:format' => 'user_registrations#index', :as => :user_export
    match 'benutzerstatistik' => 'user_statistics#index', :as => :user_statistics
    match 'registrierung/:user_registration' => 'user_registrations#edit', :as => :registration_details
    resources :imports do
      collection do
        get :for_interview
      end


    end
  end

  match 'admin' => 'admin/user_registrations#index', :as => :admin_home
  match 'admin/:workflow_state' => 'admin/user_registrations#index', :as => :admin_user_by_state
  match 'suche/:suche/:page' => 'searches#query', :as => :search_by_hash_page
  match 'suche/:suche' => 'searches#query', :as => :search_by_hash
  match 'suchen/neu' => 'searches#new', :as => :new_search
  match 'suchen/:page' => 'searches#query', :as => :search_by_page
  match 'suchen' => 'searches#query', :as => :search
  resources :searches do
    collection do
      post :query
      get :interview
      get :person_name
    end


  end

  match 'arbeitsmappe' => 'user_contents#index'
  match 'workbook' => 'user_contents#index', :locale => :en
  resources :user_contents do
    collection do
      get :segment_annotation
      post :create_annotation
      post :sort
    end
    member do
      put :publish
      get :topics
      post :retract
      put :update_topics
      put :update_annotation
      get :publish_notice
    end

  end

  resources :user_registrations
  match 'login' => 'sessions#new', :as => :anmelden
  match 'registrieren' => 'user_registrations#new', :as => :registrieren
  match 'sign_in' => 'sessions#new', :as => :en_login, :locale => :en
  match 'register' => 'user_registrations#new', :as => :en_register, :locale => :en
  match 'zugang_aktivieren/:confirmation_token' => 'user_registrations#activate', :as => :confirm_account, :method => :get
  match 'zugangsaktivierung/:confirmation_token' => 'user_registrations#confirm_activation', :as => :post_confirm_account, :method => :post
  match 'passwort_vergessen' => 'passwords#new', :as => :reset_password
  match 'neues_passwort/:reset_password_token' => 'passwords#edit', :as => :change_password
  #match 'user_accounts' => 'home#index', :as => :devise_for
  #devise_for :user_account
  match 'en/:page_id' => 'home#show', :locale => :en
  match 'en/:controller/:action' => '#index', :locale => :en
  match 'en/:controller/:action/:id' => '#index', :locale => :en
  match 'en/:controller/:action/:id.:format' => '#index', :locale => :en
  match 'en' => 'home#show', :locale => :en
  match ':page_id' => 'home#show', :as => :home
  match ':locale' => 'home#show', :as => :localized_root
  match ':locale/:page_id' => 'home#show', :as => :localized_home
  match '/' => 'home#show'
  match '/:controller(/:action(/:id))'
end