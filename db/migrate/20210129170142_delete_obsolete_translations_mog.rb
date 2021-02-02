class DeleteObsoleteTranslationsMog < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      locales = ['en', 'eng', 'en-public', 'es', 'es-public', 'lg-spa', 'ru', 'fr', 'fr-public', 'lg-fra']
      Annotation::Translation.where(locale: locales).destroy_all
      BiographicalEntry::Translation.where(locale: locales).destroy_all
      ExternalLink::Translation.where(locale: locales).destroy_all
      History::Translation.where(locale: locales).destroy_all
      Interview::Translation.where(locale: locales).destroy_all
      MetadataField::Translation.where(locale: locales).destroy_all
      Person::Translation.where(locale: locales).destroy_all
      Photo::Translation.where(locale: locales).destroy_all
      Project::Translation.where(locale: locales).destroy_all
      execute "DELETE FROM segment_translations WHERE locale IN (\"#{locales.join('","')}\");"
      execute "DELETE FROM registry_name_translations WHERE locale IN (\"#{locales.join('","')}\");"
    end
  end
end
