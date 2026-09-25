class AddNewTabLinkAccessibilityTranslation < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.ui.new_tab_link.opens_in_new_tab' => {
      ar: 'يفتح في علامة تبويب جديدة',
      de: 'öffnet in einem neuen Tab',
      el: 'ανοίγει σε νέα καρτέλα',
      en: 'opens in a new tab',
      es: 'se abre en una pestaña nueva',
      ru: 'открывается в новой вкладке',
      tr: 'yeni sekmede açılır',
      uk: 'відкривається в новій вкладці',
    },
  }.freeze

  def up
    TRANSLATIONS.each do |key, translations|
      TranslationValue.create_or_update_for_key(key, translations)
    end
  end

  def down
    TranslationValue.where(key: TRANSLATIONS.keys).destroy_all
  end
end
