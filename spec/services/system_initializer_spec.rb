require 'rails_helper'

RSpec.describe SystemInitializer do
  describe 'initialization' do
    it 'creates contribution types' do
      SystemInitializer::create

      expect(ContributionType.count).to eq(12)
    end
  end
end
