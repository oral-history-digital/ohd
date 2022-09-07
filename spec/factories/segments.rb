FactoryBot.define do
  factory :segment do
    sequence(:media_id){|n| "ZA907_01_01_00#{n}" }
    timecode { '00:00:12.05' }
    interview
    tape
    association :speaking_person, factory: :person
  end

  factory :segment_translation, class: Segment::Translation do
    segment
    locale { 'de' }
    text { 'Am Anfang, also das war...' }
    mainheading {'Anfang'}
    subheading {'Morgens'}
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

def segment_with_everything(
  timecode="00:00:02.00",
  interview=FactoryBot.create(:interview), 
  tape=FactoryBot.create(:tape, interview: interview), 
  speaker=nil,
  translations_attributes=[
    {
      locale: :de,
      text: 'Am Anfang, also das war...',
      mainheading: 'Anfang',
      subheading: 'Morgens'
    },
    {
      locale: :en,
      text: 'In the begining, it was...',
      mainheading: 'Beginning',
      subheading: 'In the morning'
    }
  ],
  registry_entries=[],
  annotations=[{de: 'Für die Unterbringung der Ostarbeiter errichtetes Barackenlager', ru: 'Построенный для размещения восточных рабочих барачный'}]
)
  segment = FactoryBot.create(:segment, interview: interview, tape: tape, timecode: timecode, speaking_person: speaker) do |segment|
    translations_attributes.each do |atts|
      FactoryBot.create(:segment_translation, atts.update(segment_id: segment.id))
    end
    registry_entries.each do |registry_entry|
      FactoryBot.create(:registry_reference, registry_entry: registry_entry, ref_object_id: segment.id, ref_object_type: 'Segment')
    end
    annotations.each do |atts|
      annotation = FactoryBot.create(:annotation, segment: segment)
      atts.each do |locale, text|
        FactoryBot.create(:annotation_translation, text: text, locale: locale, annotation_id: annotation.id)
      end
    end
  end
  segment.reload
end

