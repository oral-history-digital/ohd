require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UserAnnotation, 'when first created by user' do

  let!(:segment){FactoryGirl.create(:segment)}
  let!(:user_annotation){FactoryGirl.create(:user_annotation, reference_id: segment.id, media_id: segment.media_id)}

  it "should not be published on create" do
    expect(user_annotation.private?).to be_truthy
  end

  it "should not have an annotation associated with it on creation" do
    expect(user_annotation.annotation).to be_nil
  end

  it "should not have the shared flag set on creation" do
    expect(user_annotation.shared).to be_falsey
  end

  it "should not have an annotation associated with it when submitted" do
    user_annotation.submit!
    expect(user_annotation.annotation).to be_nil
  end

  it "should not have the shared flag set when submitted" do
    user_annotation.submit!
    expect(user_annotation.shared).to be_falsey
  end

end

describe UserAnnotation, 'when a submittal for publishing is accepted' do

  let!(:segment){FactoryGirl.create(:segment)}
  let!(:user_annotation){FactoryGirl.create(:user_annotation, reference_id: segment.id, media_id: segment.media_id)}

  before(:each) do
    user_annotation.submit!
    user_annotation.accept!
  end

  it "should have an annotation associated with it on submittal acceptance " do
    expect(user_annotation.annotation).not_to be_nil
  end

  it "should have the shared flag set when the submittal is accepted" do
    expect(user_annotation.shared).to be_truthy
  end

  it "should have an annotation object with all relevant properties as attributes" do
    annotation = user_annotation.annotation
    expect(annotation.text).to eq(user_annotation.description)
    expect(annotation.author).to eq(user_annotation.author)
    expect(annotation.media_id).to eq(user_annotation.media_id)
    expect(annotation.interview_id).to be_nil
  end

  it "should have an annotation object on which is it not valid to set an interview_id" do
    annotation = user_annotation.annotation
    annotation.interview_id = segment.interview_id
    expect(annotation).not_to be_valid
  end

  it "should not have an annotation associated and not have the shared flag set when retracted by the user" do
    user_annotation.retract!
    expect(user_annotation.annotation).to be_nil
    expect(user_annotation.shared).to be_falsey
  end

  it "should not have an annotation associated and not have the shared flag set when withdrawn by moderation" do
    user_annotation.withdraw!
    expect(user_annotation.annotation).to be_nil
    expect(user_annotation.shared).to be_falsey
  end

  it "should not have an annotation associated and not have the shared flag set when removed by moderation" do
    user_annotation.remove!
    expect(user_annotation.annotation).to be_nil
    expect(user_annotation.shared).to be_falsey
  end

end

describe UserAnnotation, "when postponed by moderation" do

  let!(:segment){FactoryGirl.create(:segment)}
  let!(:user_annotation){FactoryGirl.create(:user_annotation, reference_id: segment.id, media_id: segment.media_id)}

  before(:each) do
    user_annotation.submit!
    user_annotation.postpone!
  end

  it "should not have an annotation associated with it" do
    expect(user_annotation.annotation).to be_nil
  end

  it "should be eligible for later acceptance, creating an associated annotation" do
    user_annotation.accept!
    expect(user_annotation.annotation).not_to be_nil
    expect(user_annotation.annotation.text).to eq(user_annotation.description)
    expect(user_annotation.annotation.author).to eq(user_annotation.author)
    expect(user_annotation.annotation.media_id).to eq(user_annotation.media_id)
    expect(user_annotation.annotation.interview_id).to be_nil
  end

end

