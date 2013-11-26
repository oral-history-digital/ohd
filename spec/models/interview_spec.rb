require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Interview do
  include TranslationTestHelper

  let(:translated_object) { build(:interview) }
  describe '@full_title' do
    let(:translated_attribute) { :full_title }
    it_should_behave_like 'a translated attribute'
  end

end
