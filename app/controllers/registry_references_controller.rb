require 'action_dispatch/routing/mapper'

class RegistryReferencesController < ApplicationController

  after_action :verify_authorized, except: [:index, :locations]
  after_action :verify_policy_scoped, only: [:index, :locations]

  def create
    authorize RegistryReference
    @registry_reference = RegistryReference.create(registry_reference_params)

    clear_cache(@registry_reference.ref_object)
    Rails.cache.delete "#{Project.project_id}-interview-segments-#{@registry_reference.ref_object.interview.id}-#{@registry_reference.ref_object.interview.segments.maximum(:updated_at)}" if @registry_reference.ref_object_type == 'Segment'

    respond_to do |format|
      format.json do
        json = {}
        if @registry_reference.ref_object_type == 'Interview'
          json = {
            data_type: @registry_reference.ref_object_type.underscore.pluralize,
            "#{@registry_reference.ref_object.identifier_method}": @registry_reference.ref_object.identifier,
            nested_data_type: 'registry_references',
            nested_id: @registry_reference.id,
            data: ::RegistryReferenceSerializer.new(@registry_reference).as_json
          }
        elsif @registry_reference.ref_object_type == 'Segment'
          json = {
            archive_id: @registry_reference.ref_object.interview.archive_id,
            data_type: 'interviews',
            nested_data_type: 'segments',
            nested_id: @registry_reference.ref_object.id,
            extra_id: @registry_reference.ref_object.tape.number,
            data: ::SegmentSerializer.new(@registry_reference.ref_object).as_json
          }
        end
        render json: json
      end
    end
  end

  def update
    @registry_reference = RegistryReference.find params[:id]
    authorize @registry_reference
    @registry_reference.update_attributes registry_reference_params

    clear_cache(@registry_reference.ref_object)
    Rails.cache.delete "#{Project.project_id}-interview-segments-#{@registry_reference.ref_object.interview.id}-#{@registry_reference.ref_object.interview.segments.maximum(:updated_at)}" if @registry_reference.ref_object_type == 'Segment'

    respond_to do |format|
      format.json do
        render json: {
          data_type: @registry_reference.ref_object_type.underscore.pluralize,
          "#{@registry_reference.ref_object.identifier_method}": @registry_reference.ref_object.identifier,
          nested_data_type: 'registry_references',
          nested_id: @registry_reference.id,
          data: ::RegistryReferenceSerializer.new(@registry_reference).as_json
        }
      end
    end
  end

  def destroy 
    @registry_reference = RegistryReference.find(params[:id])
    authorize @registry_reference
    ref_object = @registry_reference.ref_object 
    @registry_reference.destroy

    clear_cache ref_object
    Rails.cache.delete "#{Project.project_id}-interview-segments-#{@registry_reference.ref_object.interview.id}-#{@registry_reference.ref_object.interview.segments.maximum(:updated_at)}" if @registry_reference.ref_object_type == 'Segment'

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json do 
        json = {}
        #
        # if ref_object is a segment we do not delete the reference client-side
        # because it is nested too deep
        # so we send back the entire segment with all its nested stuff
        #
        if ref_object.class.name == 'Segment'
          json = {
            archive_id: ref_object.interview.archive_id,
            data_type: 'interviews',
            nested_data_type: 'segments',
            nested_id: ref_object.id,
            extra_id: ref_object.tape.number,
            data: ::SegmentSerializer.new(ref_object).as_json
          }
        end
        render json: json, status: :ok
      end
    end
  end

  def locations
    policy_scope(RegistryReference)
    respond_to do |format|
      format.html do
        render layout: 'webpacker'
      end
      format.json do
        interview = Interview.find_by(archive_id: params[:archive_id])

        json = Rails.cache.fetch "#{Project.project_id}-interview-locations-#{interview.id}-#{interview.updated_at}" do
          segment_ref_locations = RegistryReference.for_interview(interview.id).with_locations.first(100)
          {
            archive_id: params[:archive_id],
            segment_ref_locations: segment_ref_locations.map{|e| ::LocationSerializer.new(e).as_json},
          }.to_json
        end
        render plain: json
      end
    end
  end

  def index
    policy_scope(RegistryReference)
    @registry_references, extra_params = 
    if params[:registry_entry_id]
      [
        policy_scope(RegistryReference).where(registry_entry_id: params[:registry_entry_id]),
        "registry_entry_id_#{params[:registry_entry_id]}"
      ]
    else
      [policy_scope(RegistryReference), nil]
    end

    respond_to do |format|
      format.html { render 'react/app' }
      format.json do
        json = {
          data: @registry_references.inject({}){|mem, s| mem[s.id] = Rails.cache.fetch("#{Project.project_id}-registry_reference-#{s.id}-#{s.updated_at}"){::RegistryReferenceSerializer.new(s).as_json}; mem},
          data_type: 'registry_references',
          extra_params: extra_params
        }.to_json
        render plain: json
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

  def registry_reference_params
    params.require(:registry_reference).permit(:registry_reference_type_id, :ref_object_id, :ref_object_type, :registry_entry_id, :ref_position, :workflow_state, :interview_id)
  end


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
