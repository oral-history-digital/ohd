FactoryBot.define do
  factory :photo do
    interview
    workflow_state { "public" }
    public_id { 'cd001_33' }
    photo_file_name { 'cd001_33.jpg' }
    photo_content_type { 'image/jpeg' }
    after(:build) do |photo|
      photo.photo.attach(io: File.open(Rails.root.join('spec', 'files', 'cd001_33.jpg')), filename: 'cd001_33.jpg', content_type: 'image/jpeg')
    end
  end

  factory :photo_translation, class: Photo::Translation do
    association :photo
    locale { "de" }
    caption { "Ein Haus am See" }
    date { '1.5.1999' }
    place { 'Berlin' }
    photographer { 'Hubert' }
    license { 'GPL' }
  end

end

def photo_with_translation(interview)
  FactoryBot.create(:photo, interview: interview) do |photo|
    FactoryBot.create(:photo_translation, photo_id: photo.id)
    photo.reload
  end
end
