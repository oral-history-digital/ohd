require 'action_dispatch/routing/mapper'

class RegistryReferencesController < BaseController

  PER_PAGE = 3000

  layout :check_for_iframe_render

  skip_before_action :authenticate_user_account!
  skip_before_action :current_search_for_side_panel
  before_action :current_search_for_side_panel_if_html # TODO: This can be done more elegantly in Rails 3 using the new :if/:unless options.
  before_action :perform_search, only: :index

  def locations
    respond_to do |format|
      format.html do
        render layout: 'webpacker'
      end
      format.json do
       interview = Interview.find_by(archive_id: params[:archive_id])
       segment_ref_locations = interview.segment_registry_entries.with_location
       interview_ref_locations = interview.segment_registry_entries.with_location
       render json: {
         segment_ref_locations: segment_ref_locations.map{|e| ::RegistryEntrySerializer.new(e)},
         interview_ref_locations: interview_ref_locations.map{|e| ::RegistryEntrySerializer.new(e)}
       }
      end
    end
  end

  def index
    respond_to do |format|
      format.html
      format.json do
        # this is the response when calling 'ortssuche.json'
        render :json => { 'results' => @results.compact.map(&:json_attrs) }.to_json
      end
      format.js do
        # this is the default response or when calling 'ortssuche.js'
        json = { 'results' => @results.compact.map(&:json_attrs) }.to_json
        render :js => params['callback'].blank? ? json : "#{params['callback']}(#{json});"
      end
    end
  end

  def full_index
    response.headers['Cache-Control'] = 'public, max-age=1209600'

    scope = {
      :joins => :registry_entry,
      :conditions => 'registry_entries.longitude IS NOT NULL AND registry_entries.latitude IS NOT NULL
                      AND registry_entries.longitude != "" AND registry_entries.latitude != ""'
    }

    if params[:page].blank? || params[:page].to_i < 1
      # Deliver number of pages.
      distinct_references = RegistryReference.count(
          scope.merge(
              :select => 'DISTINCT registry_references.interview_id,
                                   registry_references.registry_entry_id,
                                   registry_references.registry_reference_type_id'
          )
      )
      pages = (distinct_references.to_f / PER_PAGE).ceil
      respond_to do |wants|
        wants.html do
          render :text => pages
        end
        wants.json do
          render :json => { 'pages' => pages }
        end
        wants.js do
          json = { 'pages' => pages }
          render :js => json
        end
      end
    else
      # Deliver specified page.
      page = params[:page].to_i
      registry_references = RegistryReference.all(
          scope.merge(
              {
                  :select => 'MIN(registry_references.id) AS id,
                              registry_references.interview_id,
                              registry_references.registry_entry_id,
                              registry_references.registry_reference_type_id',
                  :group => 'registry_references.interview_id,
                             registry_references.registry_entry_id,
                             registry_references.registry_reference_type_id',
                  :limit => "#{(page-1)*PER_PAGE},#{PER_PAGE}",
                  :include => {
                      :interview => [:translations, {:language => :translations}],
                      :registry_reference_type => :translations
                  }
              }
          )
      )
      respond_to do |wants|
        wants.html do
          render :action => :index
        end
        wants.json do
          render :json => build_map_data(registry_references)
        end
        wants.js do
          json = build_map_data(registry_references)
          render :js => json
        end
      end
    end
  end

  def map
  end

  def map_frame
    unless params['width'].blank? && params['height'].blank?
      @map_options = {}
      @map_options['width'] = params['width'].to_i unless params['width'].blank?
      @map_options['height'] = params['height'].to_i unless params['height'].blank?
    end
  end


  private

  def query(paginate=false)
    query = {}
    query[:term] = params['location']
    if paginate
      query[:page] = if params[:page].blank?
                       1
                     else
                       params[:page].to_i
                     end
    end
    query
  end

  def perform_search
    paginate = request.xhr? ? false : true
    reference_search = RegistryReference.search(query(paginate))
    @results = reference_search.results
  end

  def check_for_iframe_render
    # render iframe only on iframe actions
    if action_name.to_s == 'map_frame'
      'iframe'
    else
      'application'
    end
  end

  MAP_LEVELS = [:country, :region, :city]  # TODO: Move this to the project configuration.

  def build_map_data(registry_references)
    map_data = {
        :registryReferences => [],
        :interviews => {},
        :registryEntries => {}
    }

    location_ids = []
    registry_references.each do |rr|
      map_data[:registryReferences] << {
          :interviewId => rr.interview_id,
          :registryEntryId => rr.registry_entry_id,
          :referenceType => rr.registry_reference_type.nil? ? '' : rr.registry_reference_type.code
      }
      map_data[:interviews][rr.interview.id] ||= {
          :archiveId => rr.interview.archive_id,
          :interviewee => rr.interview.anonymous_title(I18n.locale),
          :language => rr.interview.language.to_s,
          :translated => rr.interview.translated,
          :interviewType => rr.interview.video ? 'video' : 'audio'
      }
      location_ids << rr.registry_entry_id
    end
    location_ids.uniq!

    location_include = {
        :children => {
            :registry_names => [:registry_name_type, :translations],
            :main_registers => {:registry_names => [:registry_name_type, :translations]}
        }
    }

    # TODO: Move this to the project configuration.
    location_root = RegistryEntry.find_by_name('Ort', I18n.default_locale, :include => location_include)

    # Performance optimization: Preload all required location hierarchy information with a few DB accesses only.
    parent_locations = RegistryEntry.all(
        :select => 'DISTINCT registry_entries.*',
        :joins => 'INNER JOIN registry_hierarchies root_to_location ON registry_entries.id = root_to_location.descendant_id
                   INNER JOIN registry_hierarchies location_to_leaf ON root_to_location.descendant_id = location_to_leaf.ancestor_id',
        :conditions => [
            'root_to_location.ancestor_id = ?
             AND location_to_leaf.descendant_id IN (?)',
            location_root.id, location_ids
        ],
        :include => location_include
    )

    parent_locations.each do |location|
      location_ids << location.id
    end
    location_ids.uniq!

    location_hierarchy = {}
    ([location_root] + parent_locations).each do |parent_location|
      location_hierarchy[parent_location.id] = parent_location.children.select{|child| location_ids.include? child.id}
    end

    # Recursively identify countries, regions and cities.
    def set_location_hierarchy(current_location, parents, level, location_hierarchy, location_list)
      (location_hierarchy[current_location.id] || []).each do |location|
        raise "Duplicate location #{location}" unless location_list[location.id].blank?
        location_list[location.id] = {
            :id => location.id,
            :descriptor => location.to_s(I18n.locale),
            :longitude => location.longitude,
            :latitude => location.latitude,
            :mainRegisters => location.main_registers.map(&:to_s).join(';')
        }
        parents.each_with_index do |parent, parent_level|
          location_list[location.id][MAP_LEVELS[parent_level]] = parent
        end
        if level < MAP_LEVELS.size
          set_location_hierarchy(location, parents + [location.id], level + 1, location_hierarchy, location_list)
        end
      end
    end
    set_location_hierarchy(location_root, [], 0, location_hierarchy, map_data[:registryEntries])

    map_data.to_json
  end

end
