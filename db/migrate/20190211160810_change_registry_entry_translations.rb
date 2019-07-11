# https://projects.fu-berlin.de/browse/INTARCH-273
class ChangeRegistryEntryTranslations < ActiveRecord::Migration[5.2]
  def change
    changes_1 = {
      "Firma": "Firmen und Einsatzstellen",
      "Lager": "Lager und Haftstätten",
      "Ort": "Orte",
      "Person": "Personen"
    }
    changes_2 = {
      "AEL": "Arbeitserziehungslager",
      "Gefängnis": "Gefängnisse",
      "Ghetto": "Ghettos",
      "KZ": "Konzentrationslager",
      "Lager": "Sonstige Lager",
    }
    changes_1.keys.each do |old_value|
      new_value = changes_1[old_value]
      RegistryName::Translation.where(descriptor: old_value, locale: :de).map{ |rt|
          if(RegistryName.find(rt.registry_name_id).registry_entry.parent_ids.include?(1))
            rt.update_attributes(descriptor: new_value)
          end
      }
    end
    changes_2.keys.each do |old_value|
      new_value = changes_2[old_value]
      RegistryName::Translation.where(descriptor: old_value, locale: :de).map{ |rt|
          if(RegistryName.find(rt.registry_name_id).registry_entry.parent_ids.include?(11271))
            rt.update_attributes(descriptor: new_value)
          end
      }
    end
  end
end
