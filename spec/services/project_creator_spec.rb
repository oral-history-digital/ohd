require 'rails_helper'

RSpec.describe ProjectCreator do
  describe 'initialization' do
    it 'creates a project' do
      creator = ProjectCreator.new(shortname: 'test', initials: 't')

      creator.build

      expect(creator.project.shortname).to eq('test')
    end
  end

  describe 'creation' do
    it 'creates corresponding root registry entry' do
      creator = ProjectCreator.new(shortname: 'test', initials: 't')

      creator.create

      expect(creator.project.root_registry_entry).to exist
    end
  end
end
