class AddTranslationsForRegistryEntries < ActiveRecord::Migration[5.2]
  def change
    if Project.name.to_sym == :zwar
      RegistryName::Translation.where(:descriptor => 'Orte').each do |rt|
        rn = RegistryName.find(rt.registry_name_id)
        if rn.translations.where(:locale => :ru).size == 0 
            rn.translations.create locale: :ru, descriptor: 'Места'
        end
        if rn.translations.where(:locale => :en).size == 0 
            rn.translations.create locale: :en, descriptor: 'Places'
        end
      end
      RegistryName::Translation.where(:descriptor => 'Sonstige Lager').each do |rt|
        rn = RegistryName.find(rt.registry_name_id)
        if rn.translations.where(:locale => :ru).size == 0 
            rn.translations.create locale: :ru, descriptor: 'Прочее'
        end
        if rn.translations.where(:locale => :en).size == 0 
            rn.translations.create locale: :en, descriptor: 'Other camps'
        end
      end
      RegistryName::Translation.where(:descriptor => 'Konzentrationslager').each do |rt|
        rn = RegistryName.find(rt.registry_name_id)
        if rn.translations.where(:locale => :ru).size == 0 
            rn.translations.create locale: :ru, descriptor: 'Концлагерь'
        end
        if rn.translations.where(:locale => :en).size == 0 
            rn.translations.create locale: :en, descriptor: 'Concentration camps'
        end
      end
      RegistryName::Translation.where(:descriptor => 'Ghettos').each do |rt|
        rn = RegistryName.find(rt.registry_name_id)
        if rn.translations.where(:locale => :ru).size == 0 
            rn.translations.create locale: :ru, descriptor: 'Гетто'
        end
        if rn.translations.where(:locale => :en).size == 0 
            rn.translations.create locale: :en, descriptor: 'Ghettos'
        end
      end
      RegistryName::Translation.where(:descriptor => 'Arbeitserziehungslager').each do |rt|
        rn = RegistryName.find(rt.registry_name_id)
        if rn.translations.where(:locale => :ru).size == 0 
            rn.translations.create locale: :ru, descriptor: 'ИТЛ'
        end
        if rn.translations.where(:locale => :en).size == 0 
            rn.translations.create locale: :en, descriptor: 'Arbeitserziehungslager (“Work Education Camps”)'
        end
      end
      RegistryName::Translation.where(:descriptor => 'Gefängnisse').each do |rt|
        rn = RegistryName.find(rt.registry_name_id)
        if rn.translations.where(:locale => :ru).size == 0 
            rn.translations.create locale: :ru, descriptor: 'Тюрьма'
        end
        if rn.translations.where(:locale => :en).size == 0 
            rn.translations.create locale: :en, descriptor: 'Prisons'
        end
      end
      RegistryName::Translation.where(:descriptor => 'Lager und Haftstätten').each do |rt|
        rn = RegistryName.find(rt.registry_name_id)
        if rn.translations.where(:locale => :ru).size == 0 
            rn.translations.create locale: :ru, descriptor: 'Лагерь'
        end
        if rn.translations.where(:locale => :en).size == 0 
            rn.translations.create locale: :en, descriptor: 'Camps and detention facilities'
        end
      end
      RegistryName::Translation.where(:descriptor => 'Firmen und Einsatzstellen').each do |rt|
        rn = RegistryName.find(rt.registry_name_id)
        if rn.translations.where(:locale => :ru).size == 0 
            rn.translations.create locale: :ru, descriptor: 'Компании'
        end
        if rn.translations.where(:locale => :en).size == 0 
            rn.translations.create locale: :en, descriptor: 'Companies'
        end
      end
      RegistryName::Translation.where(:descriptor => 'Personen').each do |rt|
        rn = RegistryName.find(rt.registry_name_id)
        if rn.translations.where(:locale => :ru).size == 0 
            rn.translations.create locale: :ru, descriptor: 'Люди'
        end
        if rn.translations.where(:locale => :en).size == 0 
            rn.translations.create locale: :en, descriptor: 'People'
        end
      end
    end
  end
end
