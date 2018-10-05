class SanitizeMogSegments < ActiveRecord::Migration[5.0]
  def change
    if Project.name.to_s == :mog
      Segment.find_each do |segment|
        speaker_changed = segment.text =~ /^\S*: / ? true : false
        segment.translations.each do |t|
          t.update_attributes text: Nokogiri::HTML.parse(t.text).text.sub(/^\S*: /, "")
        end
      end
    end
  end
end
