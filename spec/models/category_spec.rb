require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Category do

  include TranslationTestHelper

  it 'is only valid when the name of the category does not already exists in the same language and category type' do
    # Save a prior category in the default language.
    prior_cat = build :category
    prior_cat.save!

    duplicate_cat = build :category
    duplicate_cat.valid?.should be_false
    Category.with_locale(:ru) do
      cat_in_different_locale = build :category
      cat_in_different_locale.valid?.should be_true
    end
    cat_with_different_type = build :category, :category_type => 'different cat type'
    cat_with_different_type.valid?.should be_true
  end

  let(:translated_object) { build :category }

  describe '@name' do
    let(:translated_attribute) { :name }
    it_should_behave_like 'a translated attribute'
  end

end
