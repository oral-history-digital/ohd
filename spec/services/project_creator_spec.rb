require 'rails_helper'

RSpec.describe ProjectCreator do

  before(:all) do
    @project_params = {
      name: 'test',
      shortname: ('a'..'z').to_a.shuffle[0,4].join,
      default_locale: 'en',
      pseudo_available_locales: "en,de",
      contact_email: 'manager@archive.com'
    }
    @user = UserAccount.first || FactoryBot.create(:user_account)
    @project = ProjectCreator.perform(@project_params, @user)
  end

  describe 'initialization' do
    subject(:project_params){ @project_params }
    subject(:user){ @user }

    it 'initializes variables' do
      creator = ProjectCreator.new(project_params, user)
      expect(creator.project_params).to eq(project_params)
      expect(creator.user).to eq(user)
    end
  end

  describe 'creation' do
    subject(:project){ @project }

    it 'creates default registry_name_types' do
      expect(project.registry_name_types.where(code: 'spelling')).to exist
      expect(project.registry_name_types.where(code: 'ancient')).to exist
      expect(project.registry_name_types.where(code: 'original')).to exist
    end

    %w(root places people subjects).each do |code|
      it "creates default #{code} registry_entry" do
        expect(project.registry_entries.where(code: code)).to exist
      end
    end

    it 'creates two translations for registry names' do
      name = project.registry_entries.where(code: 'places').first.registry_names.first
      expect(name.translations.count).to eq(2)
    end

    %w(birth_location home_location interview_location).each do |code|
      it "creates default #{code} registry_reference_type" do
        expect(project.registry_reference_types.where(code: code)).to exist
      end
      it "creates default #{code} registry_reference_type_metadata_field" do
        expect(
          project.registry_reference_type_metadata_fields.where(
            registry_reference_type_id: project.registry_reference_types.where(code: code).first.id,
            source: 'RegistryReferenceType'
          )).to exist
      end
    end

    it 'creates 11 interview_metadata_fields' do
      expect(project.metadata_fields.where(source: 'Interview').count).to eq(11)
    end

    it 'creates an interview_metadata_field with the right attributes (sample)' do
      record = project.metadata_fields.where(name: 'workflow_state').first

      expect(record.use_as_facet).to eq(true)
      expect(record.facet_order).to eq(8.0)
      expect(record.use_in_details_view).to eq(true)
      expect(record.use_in_map_search).to eq(false)
      expect(record.list_columns_order).to eq(1.0)
      expect(record.translations.count).to eq(2)
    end

    it 'creates 3 interviewee_metadata_fields' do
      expect(project.metadata_fields.where(source: 'Person').count).to eq(3)
    end

    it 'creates interviewee contribution_type' do
      expect(project.contribution_types.where(code: 'interviewee')).to exist
    end

    it 'creates 12 contribution_types' do
      expect(project.contribution_types.count).to eq(12)
    end

    it 'creates 17 task_types' do
      expect(project.contribution_types.count).to eq(12)
    end

    it 'creates 5 roles' do
      expect(project.roles.count).to eq(5)
    end

    it 'creates Erschliessung-role' do
      expect(project.roles.where(name: 'Erschliessung')).to exist
      expect(project.roles.where(name: 'Erschliessung').first.permissions.count).to eq(42)
    end

    it 'has all upload-types' do
      expect(project.upload_types).to eq(["bulk_metadata", "bulk_texts", "bulk_registry_entries", "bulk_photos"])
    end
  end
end
