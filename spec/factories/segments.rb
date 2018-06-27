FactoryGirl.define do
  factory :segment do
    sequence :media_id {|n| "ZA907_01_01_00#{n}" }
    timecode '00:00:12.05'
    transcript 'Am Anfang, also das war...'
    interview
    tape
  end
end


