class FillOriginalSegmentTexts < ActiveRecord::Migration[5.2]
  def change
    #execute "DELETE FROM segment_translations WHERE text IS NULL OR text = ''"
    #Segment.joins(:translations).group(:segment_id).count.each do |segment_id, translations_count|
      #if [1, 2].include?(translations_count)
        #Segment::Translation.where(segment_id: segment_id).each do |translation|
          #locale = translation.locale.to_s.sub('-public', '')
          #text = translation.text
          #Segment::Translation.create(segment_id: segment_id, locale: locale, text: text)
        #end
      #end
    #end
  end
end
