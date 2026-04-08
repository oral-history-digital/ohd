class AddXmlLinksTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.details.xml_links.label': {
        de: 'Metadatenschnittstelle (OAI-PMH)',
        en: 'Metadata Interface (OAI-PMH)',
        el: 'Διεπαφή Μεταδεδομένων (OAI-PMH)',
        es: 'Interfaz de Metadatos (OAI-PMH)',
        ru: 'Интерфейс метаданных (OAI-PMH)',
        uk: 'Інтерфейс метаданих (OAI-PMH)',
        ar: 'واجهة البيانات الوصفية (OAI-PMH)',
    },
    'explorer.details.xml_links.description': {
        de: 'Das Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH) ist ein webbasiertes Protokoll (Version 2.0) zum standardisierten Austausch und Sammeln (Harvesting) von Metadaten digitaler Sammlungen.',
        en: 'The Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH) is a web-based protocol (version 2.0) for the standardized exchange and harvesting of metadata from digital collections.',
        el: 'Το Πρωτόκολλο Open Archives Initiative για τη Συλλογή Μεταδεδομένων (OAI-PMH) είναι ένα διαδικτυακό πρωτόκολλο (έκδοση 2.0) για την τυποποιημένη ανταλλαγή και συλλογή μεταδεδομένων από ψηφιακές συλλογές.',
        es: 'El Protocolo de la Iniciativa de Archivos Abiertos para la Recolección de Metadatos (OAI-PMH) es un protocolo basado en la web (versión 2.0) para el intercambio y recolección estandarizada de metadatos de colecciones digitales.',
        ru: 'Протокол Open Archives Initiative для сбора метаданных (OAI-PMH) является веб-протоколом (версия 2.0) для стандартизированного обмена и сбора метаданных из цифровых коллекций.',
        uk: 'Протокол Open Archives Initiative для збору метаданих (OAI-PMH) є веб-протоколом (версія 2.0) для стандартизованого обміну та збору метаданих з цифрових колекцій.',
        ar: 'بروتوكول مبادرة الأرشيفات المفتوحة لجمع البيانات الوصفية (OAI-PMH) هو بروتوكول قائم على الويب (الإصدار 2.0) لتبادل وجمع البيانات الوصفية من المجموعات الرقمية بطريقة معيارية.',
    },
  }.freeze

  def up
    TRANSLATIONS.each do |key, translations|
      tv = TranslationValue.find_or_create_by(key: key)

      translations.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update(value: value)
      end
    end
  end

  def down
    TRANSLATIONS.keys.each do |key|
      TranslationValue.where(key: key).destroy_all
    end
  end
end
