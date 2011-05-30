ActionController::Routing::Routes.draw do |map|

  map.localized_interview_collection ':locale/teilsammlung/:project_id', :controller => :collections, :action => :show
  map.interview_collection 'teilsammlung/:project_id', :controller => :collections, :action => :show

  map.localized_interview_collections ':locale/teilsammlungen', :controller => :collections, :action => :index
  map.interview_collections 'teilsammlungen', :controller => :collections, :action => :index

  # ensure protected URLs to interview assets
  map.text_materials 'interviews/:id/text_materials/:filename.:extension', :controller => :interviews, :action => :text_materials
  map.photos 'interviews/:id/photos/:filename.:extension', :controller => :interviews, :action => :photos
  map.stills 'interviews/stills/:filename.:extension', :controller => :interviews, :action => :stills

  map.resources :interviews do |interview|

    interview.resources :tapes,
                        :collection => { :playlist => :get },
                        :member => { :transcript => :get }
  end

  map.public_locations_search 'webservice/ortssuche', :controller => :location_references, :action => :index, :format => :js
  map.public_locations_search_by_format 'webservice/ortssuche.:format', :controller => :location_references, :action => :index

  map.namespace :admin do |admin|
    admin.resources :user_registrations
    admin.user_management 'benutzerverwaltung', :controller => :user_registrations, :action => :index
    admin.user_statistics 'benutzerstatistik', :controller => :user_statistics, :action => :index
    admin.registration_details 'registrierung/:user_registration',
                               :controller => :user_registrations,
                               :action => :edit
  end

  map.search_by_hash_page 'suche/:suche/:page', :controller => :searches, :action => :create
  map.search_by_hash 'suche/:suche', :controller => :searches, :action => :create
  map.search 'suche', :controller => :searches, :action => :create

  map.resources :searches, :collection => { :interview => :post, :person_name => :post }

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
  map.change_password 'neues_passwort/:password_reset_token', :controller => :passwords, :action => :edit

  map.devise_for :user_accounts

  map.localized_home  ':locale/:page', :controller => :home, :action => :show
  map.home ':page', :controller => :home, :action => :show
  map.root :controller => :home, :action => :show, :page => 'home'
  
  # The priority is based upon order of creation: first created -> highest priority.

  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller
  
  # Sample resource route with more complex sub-resources
  #   map.resources :products do |products|
  #     products.resources :comments
  #     products.resources :sales, :collection => { :recent => :get }
  #   end

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.
  # map.root :controller => "welcome"

  # See how all your routes lay out with "rake routes"

  # Install the default routes as the lowest priority.
  # Note: These default routes make all actions in every controller accessible via GET requests. You should
  # consider removing or commenting them out if you're using named routes and resources.
  map.connect ':locale/:controller/:action/:id'
  map.connect ':locale/:controller/:action/:id.:format'

  map.connect ':controller/:action/:id', :locale => :de
  map.connect ':controller/:action/:id.:format', :locale => :de
end
