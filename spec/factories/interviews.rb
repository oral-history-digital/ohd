FactoryBot.define do

  factory :interview do
    project
    sequence(:archive_id){|n| "#{project.shortname}#{format('%03d', n)}" }
    media_type { 'video' }
    observations { '1\nInternational Slave- und Forced Labourers Documentation Project – Internationales Sklaven- und Zwangsarbeiter Befragungsprojekt\nInterview mit Adamez Konstantin Wojtowitsch\nProtokoll\nAudiointerview am 10. September 2005 in Minsk \t\n(Weißrussland/Belarus)\nAdresse: Wohnung von Adamez Konstantin Wojtowitsch' }
    description { 'an einem Sonntag ...' }
    collection
    language factory: :language, code: "rus"
    translation_language factory: :language, code: "ger"
    properties {{link: 'http://bla.de'}}
    interview_date { '2.3.1978' }
    signature_original { 'karlheinz23' }
  end

  factory :tape do
    interview
    sequence(:media_id){|n| "#{interview.archive_id.upcase}_01_01_0#{n}" }
    number { 1 }
  end

  factory :collection do
    sequence(:name){|n| "Teilsammlung #{n}" }
    project
  end

  factory :contribution do
    contribution_type_id { 1 }
    speaker_designation { 'INT' }
    person
    interview
  end

  factory :contribution_type do
    code { 'interviewee' }
    project
    use_in_export { true }
  end

end

def interview_with_contributions(interview_attibutes={})
  FactoryBot.create(:interview, interview_attibutes) do |interview|
    {interviewer: 'INT', interviewee: 'AB', cinematographer: 'KAM'}.each do |code, speaker_designation|
      person = person_with_biographical_entries
      contribution_type = FactoryBot.create(:contribution_type, code: code)
      FactoryBot.create(
        :contribution,
        interview: interview,
        speaker_designation: speaker_designation,
        person: person,
        contribution_type: contribution_type
      )
    end
    interview.reload
  end
end

def interview_with_everything(interview_attibutes={})
  interview = interview_with_contributions(interview_attibutes)
  photo = photo_with_translation(interview)

  first_tape = FactoryBot.create(:tape, interview: interview)
  second_tape = FactoryBot.create(:tape, interview: interview, number: 2)

  first_speaker = interview.contributions.first.person
  second_speaker = interview.contributions.first(2).last.person

  germany = registry_entry_with_names
  france = registry_entry_with_names({de: 'Frankreich', ru: 'Фра́нция'})
  poland = registry_entry_with_names({de: 'Polen', ru: 'По́льша'})

  segment_with_everything(
    "00:00:02.00",
    interview,
    first_tape,
    first_speaker,
    [{
      locale: :ru,
      text: "Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца",
      mainheading: "Вступление",
      subheading: nil
    }, {
      locale: :de,
      text: "Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez",
      mainheading: "Einleitung",
      subheading: nil,
    }],
    [germany],
    [{de: "Hauptsitz Berlin Filiale für die Eisenerzgewinnung in Elsass-Lothringen", ru: "Главное местонахождение — Берлин Филиал по добыче"}]
  )
  segment_with_everything(
    "00:02:02.00",
    interview,
    second_tape,
    second_speaker,
    [{
      locale: :ru,
      text: "И, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни",
      mainheading: nil,
      subheading: "жизнь" 
    }, {
      locale: :de,
      text: "Und ich würde Sie bitten, Konstantin Woitowitsch, erzählen Sie bitte Ihre Lebensgeschichte",
      mainheading: nil,
      subheading: "Leben",
    }],
    [france, poland],
    [{de: "Für die Unterbringung der Ostarbeiter errichtetes Barackenlager", ru: "Построенный для размещения восточных рабочих барачный"}]
  )
  interview.reload
end
