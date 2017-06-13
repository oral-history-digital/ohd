require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Annotation, 'upon creation' do

  #include TranslationTestHelper

  let(:interview) do
    Interview.with_locale(:de) do
      create :interview, :archive_id => 'za907', :first_name => 'Abraham', :last_name => 'Lincoln'
    end
  end

  let(:tape) do
    create :tape, :interview => interview
  end

  let(:segment1) do
    tape.segments.create \
        :media_id => 'ZA907_01_01_0001',
        :timecode => '00:00:04.12',
        :transcript => 'Räusper!',
        :translation => '',
        :interview_id => interview.id
  end

  let(:segment2) do
    tape.segments.create \
        :media_id => 'ZA907_01_01_0003',
        :timecode => '00:00:12.05',
        :transcript => 'Am Anfang, also das war...',
        :translation => '',
        :interview_id => interview.id
  end

  let(:segment3) do
    tape.segments.create \
        :media_id => 'ZA907_01_01_0007',
        :timecode => '00:00:21.03',
        :transcript => 'Wie gesagt, (...)',
        :translation => '',
        :interview_id => interview.id
  end

  let(:annotation) do
    segment1
    segment2
    segment3
    Annotation.new do |annotation|
      annotation.text = 'Hier meine Anmerkungen dazu:...'
      annotation.author = 'Meike Mustermann'
    end
  end

  it "has the correct segment assigned when supplied the segment's exact media_id" do
    annotation.media_id = 'ZA907_01_01_0003'
    annotation.save
    annotation.segment.should == segment2
  end

  it "has the correct segment assigned when supplied a subsequent media_id" do
    annotation.media_id = 'ZA907_01_01_0004'
    annotation.save
    annotation.segment.should == segment2
  end

  let(:translated_object) { annotation }

  #describe '@text' do
    #let(:translated_attribute) { :text }
    #it_should_behave_like 'a translated attribute'
  #end

end
