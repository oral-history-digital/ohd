FactoryBot.define do
  factory :segment do
    sequence(:media_id){|n| "ZA907_01_01_00#{n}" }
    timecode { '00:00:12.05' }
    interview
    tape
    #after :create do |segment|
      #create_list :segment_translation, 2, segment_id: segment.id
    #end
  end

  factory :segment_translation, class: Segment::Translation do
    segment
    #sequence(:locale){|n| "d#{n}" }
    locale { 'de' }
    text { 'Am Anfang, also das war...' }
  end
end

def segment_with_translations(locales_with_translations=[[:de, 'Am Anfang, also das war...'], [:en, 'In the begining, it was...']])
  FactoryBot.create(:segment) do |segment|
    locales_with_translations.each do |locale, text|
      FactoryBot.create(:segment_translation, segment: segment, locale: locale, text: text)
    end
    segment.reload
  end
end

