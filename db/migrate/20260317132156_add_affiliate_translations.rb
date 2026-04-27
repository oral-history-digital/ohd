class AddAffiliateTranslations < ActiveRecord::Migration[8.0]
  def up
    TranslationValue.create_or_update_for_key('edit.cooperation_partner.admin', {
      en: 'Edit cooperation partner',
      de: 'Kooperationspartner bearbeiten',
      ru: 'Партнер сотрудничества редактировать',
    })
    TranslationValue.create_or_update_for_key('edit.cooperation_partner.new', {
      en: 'Add cooperation partner',
      de: 'Kooperationspartner hinzufügen',
      ru: 'Партнер сотрудничества добавить',
    })
    TranslationValue.create_or_update_for_key('edit.leader.admin', {
      en: 'Edit leader',
      de: 'Projektleitung bearbeiten',
      ru: 'Руководитель редактировать',
    })
    TranslationValue.create_or_update_for_key('edit.leader.new', {
      en: 'Add leader',
      de: 'Projektleitung hinzufügen',
      ru: 'Руководитель добавить',
    })
    TranslationValue.create_or_update_for_key('edit.manager.admin', {
      en: 'Edit manager',
      de: 'Ansprechpartner*in bearbeiten',
      ru: 'Менеджер редактировать',
    })
    TranslationValue.create_or_update_for_key('edit.manager.new', {
      en: 'Add manager',
      de: 'Ansprechpartner*in hinzufügen',
      ru: 'Менеджер добавить',
    })
    TranslationValue.create_or_update_for_key('edit.funder.admin', {
      en: 'Edit funder',
      de: 'Förderung bearbeiten',
      ru: 'Спонсор редактировать',
    })
    TranslationValue.create_or_update_for_key('edit.funder.new', {
      en: 'Add funder',
      de: 'Förderung hinzufügen',
      ru: 'Спонсор добавить',
    })
    TranslationValue.where("translation_values.key": 'activerecord.attributes.project.pseudo_funder_names').update(
      key: 'activerecord.attributes.project.funder'
    )
  end
  def down
    TranslationValue.where(key: 'edit.cooperation_partner.admin').destroy_all
    TranslationValue.where(key: 'edit.cooperation_partner.new').destroy_all
    TranslationValue.where(key: 'edit.leader.admin').destroy_all
    TranslationValue.where(key: 'edit.leader.new').destroy_all
    TranslationValue.where(key: 'edit.manager.admin').destroy_all
    TranslationValue.where(key: 'edit.manager.new').destroy_all
    TranslationValue.where(key: 'edit.funder.admin').destroy_all
    TranslationValue.where(key: 'edit.funder.new').destroy_all
    TranslationValue.where("translation_values.key": 'activerecord.attributes.project.funder').update(
      key: 'activerecord.attributes.project.pseudo_funder_names'
    )
  end
end
