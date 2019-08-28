class UnifyMogData < ActiveRecord::Migration[5.2]
  def change
    if Project.name.to_sym == :mog
      Contribution.where(contribution_type: 'Informants').update_all contribution_type: 'interviewee'
      Contribution.where(contribution_type: 'Interviewer').update_all contribution_type: 'interviewer'
      Contribution.where(contribution_type: 'Transcribed / described').update_all contribution_type: 'transcriptor'
      Contribution.where(contribution_type: 'Translated').update_all contribution_type: 'translator'
      Contribution.where(contribution_type: 'Indexed').update_all contribution_type: 'segmentator'
      Contribution.where(contribution_type: 'Quality management translation').update_all contribution_type: 'quality_manager_translation'
      Contribution.where(contribution_type: 'Quality management transcription').update_all contribution_type: 'quality_manager_transcription'
      Contribution.where(contribution_type: 'Quality management interviewing').update_all contribution_type: 'quality_manager_interviewing'
      Contribution.where(contribution_type: 'Quality management indexation').update_all contribution_type: 'quality_manager_research'
      Contribution.where(contribution_type: 'Camera recorder').update_all contribution_type: 'cinematographer'


      execute "UPDATE collection_translations SET locale = 'el' WHERE locale='ell';"
      execute "UPDATE collection_translations SET locale = 'de' WHERE locale='deu';"
      execute "UPDATE collection_translations SET locale = 'en' WHERE locale='eng';"

      execute "UPDATE language_translations SET locale = 'el' WHERE locale='ell';"
      execute "UPDATE language_translations SET locale = 'de' WHERE locale='deu';"
      execute "UPDATE language_translations SET locale = 'en' WHERE locale='eng';"

      execute "UPDATE photo_translations SET locale = 'el' WHERE locale='ell';"
      execute "UPDATE photo_translations SET locale = 'de' WHERE locale='deu';"
      execute "UPDATE photo_translations SET locale = 'en' WHERE locale='eng';"

      execute "UPDATE interview_translations SET locale = 'el' WHERE locale='ell';"
      execute "UPDATE interview_translations SET locale = 'de' WHERE locale='deu';"
      execute "UPDATE interview_translations SET locale = 'en' WHERE locale='eng';"

      execute "UPDATE registry_name_translations SET locale = 'el' WHERE locale='ell';"
      execute "UPDATE registry_name_translations SET locale = 'de' WHERE locale='deu';"
      execute "UPDATE registry_name_translations SET locale = 'en' WHERE locale='eng';"

      execute "UPDATE person_translations SET locale = 'el' WHERE locale='ell';"
      execute "UPDATE person_translations SET locale = 'de' WHERE locale='deu';"
      execute "UPDATE person_translations SET locale = 'en' WHERE locale='eng';"

      execute "UPDATE segment_translations SET locale = 'el' WHERE locale='ell';"
      execute "UPDATE segment_translations SET locale = 'de' WHERE locale='deu';"
      execute "UPDATE segment_translations SET locale = 'en' WHERE locale='eng';"

      execute "UPDATE annotation_translations SET locale = 'el' WHERE locale='ell';"
      execute "UPDATE annotation_translations SET locale = 'de' WHERE locale='deu';"
      execute "UPDATE annotation_translations SET locale = 'en' WHERE locale='eng';"

      execute "UPDATE biographical_entry_translations SET locale = 'el' WHERE locale='ell';"
      execute "UPDATE biographical_entry_translations SET locale = 'de' WHERE locale='deu';"
      execute "UPDATE biographical_entry_translations SET locale = 'en' WHERE locale='eng';"

      execute "UPDATE registry_reference_type_translations SET locale = 'el' WHERE locale='ell';"
      execute "UPDATE registry_reference_type_translations SET locale = 'de' WHERE locale='deu';"
      execute "UPDATE registry_reference_type_translations SET locale = 'en' WHERE locale='eng';"
    end

    if Project.name.to_sym == :zwar
      Contribution.where(contribution_type: 'interview').update_all contribution_type: 'interviewer'
      Contribution.where(contribution_type: 'transcript').update_all contribution_type: 'transcriptor'
      Contribution.where(contribution_type: 'translation').update_all contribution_type: 'translator'
      Contribution.where(contribution_type: 'segmentation').update_all contribution_type: 'segmentator'
      Contribution.where(contribution_type: 'Camera recorder').update_all contribution_type: 'cinematographer'
      Contribution.where(contribution_type: 'proof_reading').update_all contribution_type: 'proofreader'
    end

  end
end
