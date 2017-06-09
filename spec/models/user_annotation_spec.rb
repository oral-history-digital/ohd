require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserAnnotation, 'when first created by user' do

  before(:each) do
    @user = init_user
    @segment = init_segment
    @user_annotation = init_annotation(@segment, @user, 'Oh wirklich?')
  end

  it "should not be published on create" do
    expect(@user_annotation.private?).to be_truthy
  end

  it "should not have an annotation associated with it on creation" do
    expect(@user_annotation.annotation).to be_nil
  end

  it "should not have the shared flag set on creation" do
    expect(@user_annotation.shared).to be_falsey
  end

  it "should not have an annotation associated with it when submitted" do
    @user_annotation.submit!
    expect(@user_annotation.annotation).to be_nil
  end

  it "should not have the shared flag set when submitted" do
    @user_annotation.submit!
    expect(@user_annotation.shared).to be_falsey
  end

end

describe UserAnnotation, 'when a submittal for publishing is accepted' do

  before(:each) do
    @user = init_user
    @segment = init_segment
    @user_annotation = init_annotation(@segment, @user, 'Oh wirklich?')
    @user_annotation.submit!
    @user_annotation.accept!
  end

  it "should have an annotation associated with it on submittal acceptance " do
    expect(@user_annotation.annotation).not_to be_nil
  end

  it "should have the shared flag set when the submittal is accepted" do
    expect(@user_annotation.shared).to be_truthy
  end

  it "should have an annotation object with all relevant properties as attributes" do
    annotation = @user_annotation.annotation
    expect(annotation.text).to eq(@user_annotation.description)
    expect(annotation.author).to eq(@user_annotation.author)
    expect(annotation.media_id).to eq(@user_annotation.media_id)
    expect(annotation.interview_id).to be_nil
  end

  it "should have an annotation object on which is it not valid to set an interview_id" do
    annotation = @user_annotation.annotation
    annotation.interview_id = @segment.interview_id
    expect(annotation).not_to be_valid
  end

  it "should not have an annotation associated and not have the shared flag set when retracted by the user" do
    @user_annotation.retract!
    expect(@user_annotation.annotation).to be_nil
    expect(@user_annotation.shared).to be_falsey
  end

  it "should not have an annotation associated and not have the shared flag set when withdrawn by moderation" do
    @user_annotation.withdraw!
    expect(@user_annotation.annotation).to be_nil
    expect(@user_annotation.shared).to be_falsey
  end

  it "should not have an annotation associated and not have the shared flag set when removed by moderation" do
    @user_annotation.remove!
    expect(@user_annotation.annotation).to be_nil
    expect(@user_annotation.shared).to be_falsey
  end

end

describe UserAnnotation, "when postponed by moderation" do

  before(:each) do
    @user = init_user
    @segment = init_segment
    @user_annotation = init_annotation(@segment, @user, 'Oh wirklich?')
    @user_annotation.submit!
    @user_annotation.postpone!
  end

  it "should not have an annotation associated with it" do
    expect(@user_annotation.annotation).to be_nil
  end

  it "should be eligible for later acceptance, creating an associated annotation" do
    @user_annotation.accept!
    expect(@user_annotation.annotation).not_to be_nil
    expect(@user_annotation.annotation.text).to eq(@user_annotation.description)
    expect(@user_annotation.annotation.author).to eq(@user_annotation.author)
    expect(@user_annotation.annotation.media_id).to eq(@user_annotation.media_id)
    expect(@user_annotation.annotation.interview_id).to be_nil
  end

end


def init_user
  @user = User.first || User.create do |user|
    user.first_name = 'Xago'
    user.last_name = 'Yoyo'
  end
end

def init_segment
  @interview ||= Interview.create do |interview|
    interview.archive_id = 'za907'
    interview.first_name = 'Abraham'
    interview.last_name = 'Lincoln'
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
