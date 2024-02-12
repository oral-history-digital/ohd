require 'action_dispatch/routing/mapper'

class RegistryReferencesController < ApplicationController
  after_action :verify_authorized, except: [:index, :locations, :location_references, :for_reg_entry]
  after_action :verify_policy_scoped, only: [:index, :locations]

  def create
    authorize RegistryReference
    @registry_reference = RegistryReference.create(registry_reference_params)

    interview = Interview.find(registry_reference_params[:interview_id])
    Sunspot.index! interview

    respond @registry_reference
  end

  def update
    @registry_reference = RegistryReference.find params[:id]
    authorize @registry_reference
    @registry_reference.update registry_reference_params

    Sunspot.index! @registry_reference.interview

    respond @registry_reference
  end

  def destroy
    @registry_reference = RegistryReference.find(params[:id])
    authorize @registry_reference
    ref_object = @registry_reference.ref_object
    interview = @registry_reference.interview

    @registry_reference.destroy
    ref_object.touch
    Sunspot.index! interview

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

        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-interview-locations-#{interview.id}-#{I18n.locale}-#{interview.updated_at}" do
          interviewee = interview.interviewee
          registry_entries = RegistryEntry.for_map([interviewee&.id], [interview.id], 'all')

          ActiveModelSerializers::SerializableResource.new(registry_entries,
            each_serializer: SlimRegistryEntryMapSerializer
          ).as_json
        end

        render json: json
      end
    end
  end

  def location_references
    respond_to do |format|
      format.json do
        interview = Interview.find_by(archive_id: params[:archive_id])
        registry_entry_id = params[:registry_entry_id]
        interviewee = interview.interviewee
        repository = RegistryReferenceRepository.new

        person_references = repository.interview_map_person_references_for(registry_entry_id, I18n.locale, interviewee.id)
        interview_references = repository.interview_map_interview_references_for(registry_entry_id, I18n.locale, interview.id)
        segment_references = repository.interview_map_segment_references_for(registry_entry_id, interview.id)

        combined_references = person_references.to_a + interview_references.to_a

        persons_serialized = ActiveModelSerializers::SerializableResource.new(combined_references, each_serializer: InterviewMapPersonReferencesSerializer)
        segments_serialized = ActiveModelSerializers::SerializableResource.new(segment_references, each_serializer: InterviewMapSegmentReferencesSerializer)

        references = {
          person_references: persons_serialized,
          segment_references: segments_serialized
        }

        render json: references
      end
    end
  end

  def for_reg_entry
    registry_entry_id = params[:id]
    signed_in = current_user.present?
    #scope = map_scope

    repository = RegistryReferenceRepository.new

    interview_refs = repository.interview_references_for(registry_entry_id)
    interview_refs_serialized = ActiveModelSerializers::SerializableResource.new(interview_refs,
      each_serializer: SlimRegistryReferenceSerializer,
      default_locale: current_project.default_locale,
      signed_in: signed_in)

    segment_refs = repository.segment_references_for(registry_entry_id)
    segment_refs_serialized = ActiveModelSerializers::SerializableResource.new(segment_refs,
      each_serializer: SlimSegmentRegistryReferenceSerializer,
      default_locale: current_project.default_locale,
      signed_in: signed_in)

    render json: {
      interview_references: interview_refs_serialized,
      segment_references: segment_refs_serialized
    }
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
          data: @registry_references.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
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
            archive_id: registry_reference.ref_object.archive_id,
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
