require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Interview do
  #include TranslationTestHelper

  let(:translated_object) { build(:interview) }

  TRANSLATED_ATTS = [
      :first_name, :other_first_names, :last_name, :birth_name,
      :return_date, :forced_labor_details,
      :interviewers, :transcriptors, :translators,
      :proofreaders, :segmentators, :researchers
  ]

  TRANSLATED_ATTS.each do |attr|

    #describe "@#{attr}" do
      #let(:translated_attribute) { attr }
      #it_should_behave_like 'a translated attribute'
    #end

  end

end
