namespace :help_texts do

  desc 'create default help texts'
  task :create, [:project_initials] => :environment do |t, args|
    create_count = 0
    update_count = 0

    help_texts.each do |text|
      code = text[0]
      description = text[1]

      old_help_text = HelpText.find_by_code(code)
      if old_help_text.present?
        if old_help_text.description != description
          old_help_text.update(description: description)
          update_count += 1
          puts "Updating help text #{code}."
        end
      else
        HelpText.create(code: code, description: description)
        create_count += 1
        puts "Creating help text #{code}."
      end
    end

    puts "Created #{create_count}, updated #{update_count} help texts in total."
  end

  def help_texts
    [
      ['archive_form', 'New/edit archive form'],
      ['assign_speakers_form', 'Assign speakers form'],
      ['biographical_entry_form', 'Biographical entry form'],
      ['collection_form', 'New/edit collection form'],
      ['contribution_form', 'Contribution form'],
      ['contribution_type_form', 'New/edit contribution type form'],
      ['heading_form', 'Heading or table of contents form'],
      ['help_text_form', 'Help text form'],
      ['institution_form', 'New/edit institution form'],
      ['interview_form', 'New interview form'],
      ['language_form', 'New/edit language form'],
      ['logo_form', 'New/edit logo form'],
      ['mark_text_form', 'Mark text form'],
      ['mediapath_form', 'New/edit mediapath form'],
      ['metadata_form', 'New/edit metadata form'],
      ['norm_datum_form', 'Norm datum form (sub form of registry entry)'],
      ['permission_form', 'New/edit permission form'],
      ['person_form', 'New/edit person form'],
      ['photo_form', 'Photo form'],
      ['registry_entry_form', 'Registry entry form'],
      ['registry_name_form', 'Registry name sub form'],
      ['registry_name_type_form', 'New/edit registry name type form'],
      ['registry_reference_form', 'Registry reference form'],
      ['registry_reference_type_form', 'New/edit registry reference type form'],
      ['role_form', 'New/edit role form'],
      ['segment_form', 'Segment form within transcripts'],
      ['sponsor_logo_form', 'New/edit sponsor logo form'],
      ['task_type_form', 'New/edit task type form'],
      ['import_form', 'New import (upload) form']
    ]
  end
end
