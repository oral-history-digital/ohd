require 'rails_helper'

RSpec.describe ProjectCreator do

  before(:all) do
    @project_params = {
      name: 'test',
      shortname: 'te',
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

    it 'creates default registry_name_type' do
      expect(project.registry_name_types.where(code: 'spelling')).to exist
    end

    %w(root place people subjects).each do |code|
      it "creates default #{code} registry_entry" do
        expect(project.registry_entries.where(code: code)).to exist
      end
    end

    %w(birh_location home_location interview_location).each do |code|
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

    it 'creates 13 interview_metadata_fields' do
      expect(project.metadata_fields.where(source: 'Interview').count).to eq(13)
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
      expect(project.roles.where(name: 'Erschliessung').first.permissions.count).to eq(41)
    end

  end
end
