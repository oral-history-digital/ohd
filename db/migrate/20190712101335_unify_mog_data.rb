class UnifyMogData < ActiveRecord::Migration[5.2]
  def change
    if Project.name.to_sym == :mog
      Contribution.where(contribution_type: 'Informants').update_all contribution_type: 'interviewee'
      Contribution.where(contribution_type: 'Interviewer').update_all contribution_type: 'interviewer'
      Contribution.where(contribution_type: 'Transcribed / described').update_all contribution_type: 'transcriptor'
      Contribution.where(contribution_type: 'Translated').update_all contribution_type: 'translator'
      Contribution.where(contribution_type: 'Indexed').update_all contribution_type: 'segmentator'

      connection.execute(<<-EOQ)
        UPDATE segment_translations SET locale = 'el' WHERE locale='ell';
        UPDATE segment_translations SET locale = 'de' WHERE locale='deu';
        UPDATE segment_translations SET locale = 'en' WHERE locale='eng';

        UPDATE annotation_translations SET locale = 'el' WHERE locale='ell';
        UPDATE annotation_translations SET locale = 'de' WHERE locale='deu';
        UPDATE annotation_translations SET locale = 'en' WHERE locale='eng';

        UPDATE biographical_entry_translations SET locale = 'el' WHERE locale='ell';
        UPDATE biographical_entry_translations SET locale = 'de' WHERE locale='deu';
        UPDATE biographical_entry_translations SET locale = 'en' WHERE locale='eng';

        UPDATE registry_reference_type_translations SET locale = 'el' WHERE locale='ell';
        UPDATE registry_reference_type_translations SET locale = 'de' WHERE locale='deu';
        UPDATE registry_reference_type_translations SET locale = 'en' WHERE locale='eng';

        UPDATE text_materials SET locale = 'el' WHERE locale='ell';
        UPDATE text_materials SET locale = 'de' WHERE locale='deu';
        UPDATE text_materials SET locale = 'en' WHERE locale='eng';
      EOQ
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
