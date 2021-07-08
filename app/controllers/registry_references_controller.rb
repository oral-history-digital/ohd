require 'action_dispatch/routing/mapper'

class RegistryReferencesController < ApplicationController

  after_action :verify_authorized, except: [:index, :locations, :location_references]
  after_action :verify_policy_scoped, only: [:index, :locations]

  def create
    authorize RegistryReference
    @registry_reference = RegistryReference.create(registry_reference_params)

    respond @registry_reference
  end

  def update
    @registry_reference = RegistryReference.find params[:id]
    authorize @registry_reference
    @registry_reference.update_attributes registry_reference_params

    respond @registry_reference
  end

  def destroy
    @registry_reference = RegistryReference.find(params[:id])
    authorize @registry_reference
    ref_object = @registry_reference.ref_object
    @registry_reference.destroy
    ref_object.touch

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
            data: cache_single(ref_object)
          }
        elsif ref_object.class.name == 'Person'
          json = {
            nested_id: ref_object.id,
            data: cache_single(ref_object, 'PersonWithAssociations'),
            nested_data_type: "people",
            data_type: 'projects',
            id: current_project.id,
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
        interviewee = interview.interviewee

        segment_entries = RegistryEntry.for_interview_map('de', interview.id)
        person_entries = RegistryEntry.for_map('de', [interviewee.id])

        registry_entries = segment_entries.to_a.concat(person_entries.to_a)

        json2 = ActiveModelSerializers::SerializableResource.new(registry_entries,
          each_serializer: SlimRegistryEntryMapSerializer
        ).as_json

        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-interview-locations-#{interview.id}-#{interview.updated_at}" do
          segment_ref_locations = RegistryReference.segments_for_interview(interview.id).with_locations.first(100)
          #interview_ref_locations = RegistryReference.for_interview(interview.id).with_locations
          {
            archive_id: params[:archive_id],
            segment_ref_locations: segment_ref_locations.map{|e| ::LocationSerializer.new(e).as_json},
            #interview_ref_locations: interview_ref_locations.map{|e| ::LocationSerializer.new(e).as_json},
          }.to_json
        end

        render json: json2
      end
    end
  end

  def location_references
    respond_to do |format|
      format.json do
        interview = Interview.find_by(archive_id: params[:archive_id])
        registry_entry_id = params[:registry_entry_id]
        interviewee = interview.interviewee

        registry_references = RegistryReference.for_interview_map_registry_entry(registry_entry_id, I18n.locale, interviewee.id)
        #authorize registry_references

        render json: registry_references, each_serializer: SlimRegistryReferenceInterviewMapSerializer
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
          data: @registry_references.inject({}){|mem, s| mem[s.id] = Rails.cache.fetch("#{current_project.cache_key_prefix}-registry_reference-#{s.id}-#{s.updated_at}"){::RegistryReferenceSerializer.new(s).as_json}; mem},
          data_type: 'registry_references',
          extra_params: extra_params
        }.to_json
        render plain: json
      end
    end
  end

  private

  def respond registry_reference
    registry_reference.ref_object.touch
    registry_reference.reload

    respond_to do |format|
      format.json do
        json = {}
        if registry_reference.ref_object_type == 'Interview'
          json = {
            archive_id: registry_reference.ref_object.interview.archive_id,
            data_type: 'interviews',
            nested_data_type: 'registry_references',
            nested_id: registry_reference.id,
            data: cache_single(registry_reference)
          }
        elsif registry_reference.ref_object_type == 'Person'
          json = {
            nested_id: registry_reference.ref_object_id,
            data: cache_single(registry_reference.ref_object, 'PersonWithAssociations'),
            nested_data_type: "people",
            data_type: 'projects',
            id: current_project.id
          }
        elsif registry_reference.ref_object_type == 'Segment'
          json = {
            archive_id: registry_reference.ref_object.interview.archive_id,
            data_type: 'interviews',
            nested_data_type: 'segments',
            nested_id: registry_reference.ref_object.id,
            extra_id: registry_reference.ref_object.tape.number,
            data: cache_single(registry_reference.ref_object)
          }
        end
        render json: json
      end
    end
  end

  def registry_reference_params
    params.require(:registry_reference).permit(:registry_reference_type_id, :ref_object_id, :ref_object_type, :registry_entry_id, :ref_position, :workflow_state, :interview_id)
  end

end
