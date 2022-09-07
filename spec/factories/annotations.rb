FactoryBot.define do
  factory :annotation do
    workflow_state { "public" }

    #after :create do |annotation|
      #create :annotation_translation, annotation: annotation
      #create :annotation_translation, annotation: annotation, locale: :en, text: 'the weather was fine'
    #end
  end

  factory :annotation_translation, class: Annotation::Translation do
    association :annotation
    locale { "de" }
    text { "das Wetter war schön" }
  end

end


