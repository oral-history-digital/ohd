require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Annotation, 'upon creation' do

  before :each do
    init_segments
    @annotation = Annotation.new
    @annotation.text = 'Hier meine Anmerkungen dazu:...'
    @annotation.author = 'Meike Mustermann'
  end

  it "will have the correct segment assigned when supplied the segment's exact media_id" do
    @annotation.media_id = 'ZA907_01_01_0003'
    @annotation.save
    @annotation.segment.should == @segment2
  end

  it "will have the correct segment assigned when supplied a subsequent media_id" do
    @annotation.media_id = 'ZA907_01_01_0004'
    @annotation.save
    @annotation.segment.should == @segment2
  end


end

def init_segments
  @interview ||= Interview.create do |interview|
    interview.archive_id = 'za907'
    interview.full_title = 'Abraham Lincoln'
    interview.country_of_origin = 'Vereinigte Staaten'
  end
  @tape ||= Tape.create do |tape|
    tape.media_id = 'ZA907_01_01'#
    tape.interview = @interview
  end
  @segment1 ||= @tape.segments.build do |segment|
    segment.media_id = 'ZA907_01_01_0001'
    segment.timecode = '00:00:04.12'
    segment.transcript = 'Räusper!'
    segment.translation = ''
    segment.interview_id = @interview.id
  end
  @segment1.save
  @segment2 ||= @tape.segments.build do |segment|
    segment.media_id = 'ZA907_01_01_0003'
    segment.timecode = '00:00:12.05'
    segment.transcript = 'Am Anfang, also das war...'
    segment.translation = ''
    segment.interview_id = @interview.id
  end
  @segment2.save
  @segment3 ||= @tape.segments.build do |segment|
    segment.media_id = 'ZA907_01_01_0007'
    segment.timecode = '00:00:21.03'
    segment.transcript = 'Wie gesagt, (...)'
    segment.translation = ''
    segment.interview_id = @interview.id
  end
  @segment3.save
end