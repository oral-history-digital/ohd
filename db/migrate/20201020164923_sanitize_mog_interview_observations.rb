class SanitizeMogInterviewObservations < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      Interview.all.each do |interview|
        interview.translations.each do |translation|
          interview.update_attributes observations: Nokogiri::HTML.parse(translation.observations).text.sub(/^:[\S ]/, "").sub(/\*[A-Z]{1,3}:\*[\S ]/, ''), locale: translation.locale
        end
      end
    end
  end
end
