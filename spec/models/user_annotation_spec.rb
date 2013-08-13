require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserAnnotation, 'when first created by user' do

  before(:each) do
    @user = init_user
    @segment = init_segment
    @user_annotation = init_annotation(@segment, @user, 'Oh wirklich?')
  end

  it "should not be published on create" do
    @user_annotation.private?.should be_true
  end

end

describe UserAnnotation, 'when processed for publishing' do

end


def init_user
  @user = User.find(:first) || User.create do |user|
    user.first_name = 'Xago'
    user.last_name = 'Yoyo'
  end
end

def init_segment
  @interview ||= Interview.create do |interview|
    interview.archive_id = 'za907'
    interview.full_title = 'Abraham Lincoln'
    interview.country_of_origin = 'Vereinigte Staaten'
  end
  @tape ||= Tape.create do |tape|
    tape.media_id = 'ZA907_01_01'#
    tape.interview = @interview
  end
  @segment ||= @tape.segments.build do |segment|
    segment.media_id = 'ZA907_01_01_0001'
    segment.timecode = '00:00:04.12'
    segment.transcript = 'Räusper!'
    segment.translation = ''
    segment.interview_id = @interview.id
  end
  @segment.save
  @segment
end

def init_annotation(segment, user, text)
  annotation = UserAnnotation.create do |annotation|
    annotation.user = user
    annotation.reference = segment
  end
  annotation.attributes = annotation.user_content_attributes
  annotation.media_id = segment.media_id
  annotation.description = text
  annotation.save
  annotation
end