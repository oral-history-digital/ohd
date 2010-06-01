ActionController::Routing::Routes.draw do |map|

  map.localized_collection ':locale/teilsammlung/:project_id', :controller => :collections, :action => :show
  map.collection 'teilsammlung/:project_id', :controller => :collections, :action => :show

  map.localized_collections ':locale/teilsammlungen', :controller => :collections, :action => :index
  map.collections 'teilsammlungen', :controller => :collections, :action => :index

  map.resources :interviews do |interview|

    interview.resources :tapes,
                        :collection => { :playlist_high => :get, :playlist_low => :get, :playlist_audio => :get },
                        :member => { :transcript => :get }
  end

  map.search 'suche', :controller => :searches, :action => :new

  map.resources :searches, :collection => { :interview => :post, :person_name => :post }

  map.devise_for :user_accounts

  map.localized_home  ':locale/:page', :controller => :home, :action => :show
  map.home ':page', :controller => :home, :action => :show
  map.root :controller => :home, :action => :show, :page => 'archive'
  
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
