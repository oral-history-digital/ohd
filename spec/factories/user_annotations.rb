FactoryGirl.define do
  factory :user_annotation do
    #segment
    user
    sequence :media_id {|n| "ZA907_01_01_0#{n}" }
    description 'Oh nein ...'
    #reference
    reference_type 'Segment'
    reference_id 2
  end
end


