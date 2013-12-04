ActionController::Routing::Routes.draw do |map|

  map.localized_interview_collection ':locale/teilsammlung/:project_id', :controller => :collections, :action => :show
  map.interview_collection 'teilsammlung/:project_id', :controller => :collections, :action => :show

  map.localized_interview_collections ':locale/teilsammlungen', :controller => :collections, :action => :index
  map.interview_collections 'teilsammlungen', :controller => :collections, :action => :index

  # ensure protected URLs to interview assets
  map.text_materials 'interviews/:id/text_materials/:filename.:extension', :controller => :interviews, :action => :text_materials
  map.photos 'interviews/:id/photos/:filename.:extension', :controller => :interviews, :action => :photos
  map.stills 'interviews/stills/:filename.:extension', :controller => :interviews, :action => :stills
  map.interview_locations 'interviews/:id/in/:location_name', :controller => :interviews, :action => :show

  map.resources :interviews do |interview|

    interview.resources :tapes,
                        :collection => { :playlist => :get },
                        :member => { :transcript => :get }

  end

  map.public_locations_search 'webservice/ortssuche', :controller => :location_references, :action => :index, :format => :js
  map.public_locations_search_by_format 'webservice/ortssuche.:format', :controller => :location_references, :action => :index
  map.public_locations_total_pages 'webservice/:date/orte.:format', :controller => :location_references, :action => :full_index
  map.public_locations_by_page 'webservice/:date/orte/satz.:page.:format', :controller => :location_references, :action => :full_index

  map.public_map 'karte', :controller => :location_references, :action => :map
  map.localized_public_map ':locale/map', :controller => :location_references, :action => :map
  map.map_frame 'kartenframe', :controller => :location_references, :action => :map_frame, :locale => :de
  map.localized_map_frame ':locale/mapframe', :controller => :location_references, :action => :map_frame

  map.namespace :admin do |admin|
    admin.resources :users, { :collection => { :admin => :get }, :member => { :flag => :post }}
    admin.resources :user_registrations, { :member => { :subscribe => :post, :unsubscribe => :post } }
    admin.user_management 'benutzerverwaltung', :controller => :user_registrations, :action => :index
    admin.user_export     'benutzerverwaltung.:format', :controller => :user_registrations, :action => :index
    admin.user_statistics 'benutzerstatistik', :controller => :user_statistics, :action => :index
    admin.registration_details 'registrierung/:user_registration',
                               :controller => :user_registrations,
                               :action => :edit
    admin.resources :imports,
                    :collection => { :for_interview => :get }
  end
  map.admin_home 'admin', :controller => 'admin/user_registrations', :action => :index
  map.admin_user_by_state 'admin/:workflow_state', :controller => 'admin/user_registrations', :action => :index

  map.search_by_hash_page 'suche/:suche/:page', :controller => :searches, :action => :query
  map.search_by_hash 'suche/:suche', :controller => :searches, :action => :query
  map.new_search 'suchen/neu', :controller => :searches, :action => :new
  map.search_by_page 'suchen/:page', :controller => :searches, :action => :query
  map.search 'suchen', :controller => :searches, :action => :query

  map.resources :searches, :collection => { :query => :post,
                                            :interview => :get,
                                            :person_name => :get }

  map.connect 'arbeitsmappe', :locale => :de, :controller => :user_contents, :action => :index
  map.connect 'workbook', :locale => :en, :controller => :user_contents, :action => :index

  map.resources :user_contents,
                :member => { :topics => :get, :update_topics => :put, :update_annotation => :put },
                :collection => { :sort => :post, :segment_annotation => :get, :create_annotation => :post }

  map.resources :user_registrations, :path_prefix => 'anmeldung'

  # DE
  map.anmelden        'login',        :controller => :sessions, :action => :new
  map.registrieren    'registrieren', :controller => :user_registrations, :action => :new

  # EN
  map.en_login        'sign_in',      :controller => :sessions, :action => :new, :locale => 'en'
  map.en_register     'register',     :controller => :user_registrations, :action => :new, :locale => 'en'

  map.confirm_account 'zugang_aktivieren/:confirmation_token', :controller => :user_registrations, :action => :activate, :method => :get
  map.post_confirm_account 'zugangsaktivierung/:confirmation_token', :controller => :user_registrations, :action => :confirm_activation, :method => :post
  map.reset_password  'passwort_vergessen', :controller => :passwords, :action => :new
  map.change_password 'neues_passwort/:reset_password_token', :controller => :passwords, :action => :edit

  map.devise_for :user_accounts

  map.connect 'de/:page_id', :locale => :de, :controller => :home, :action => :show
  map.connect 'de/:controller/:action', :locale => :de
  map.connect 'de/:controller/:action/:id', :locale => :de
  map.connect 'de/:controller/:action/:id.:format', :locale => :de
  map.connect 'de', :locale => :de, :controller => :home, :action => :show

  map.connect 'en/:page_id', :locale => :en, :controller => :home, :action => :show
  map.connect 'en/:controller/:action', :locale => :en
  map.connect 'en/:controller/:action/:id', :locale => :en
  map.connect 'en/:controller/:action/:id.:format', :locale => :en
  map.connect 'en', :locale => :en, :controller => :home, :action => :show

  map.home ':page_id', :controller => :home, :action => :show
  map.localized_root ':locale', :controller => :home, :action => :show
  map.localized_home  ':locale/:page_id', :controller => :home, :action => :show
  map.root :controller => :home, :action => :show

  map.connect ':controller/:action/:id', :locale => :de
  map.connect ':controller/:action/:id.:format', :locale => :de

end
