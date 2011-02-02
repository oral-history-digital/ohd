module InterviewHelper

  # transforms the headings array into a hash structure
  # which renders the hierarchy better
  def hashed_headings_from_array(headings)
    headings_hash = {}

    section_number = 0

    headings.each do |heading|
      # values for the player seeking
      player_item = (heading.tape.number-1).to_s
      player_pos = heading.start_time.round.to_s
      # html
      heading_id = "heading_" + player_item + "_" + player_pos

      if !heading.mainheading.blank?
        section_number = headings_hash.keys.size + 1
        headings_hash[section_number] = {
                :title => heading.mainheading,
                :item => player_item,
                :timecode => heading.raw_timecode.to_s,
                :pos => player_pos,
                :id => heading_id,
                :subheadings => []
        }
      end
      if !heading.subheading.blank? && !headings_hash[section_number].nil?
        # add the subheading to the current mainheading
        headings_hash[section_number][:subheadings] << {
                :title => heading.subheading,
                :item => player_item,
                :timecode => heading.raw_timecode.to_s,
                :pos => player_pos,
                :id => heading_id
        }
      end
    end

    headings_hash
  end


  # formats the languages for the transcript language tabs
  def formatted_languages(interview)
    truncate_language_names = interview.languages.size > 1
    interview.languages.map do |lang|
      lang_name = t(lang, :scope => 'mediaplayer.languages')
      if truncate_language_names && lang_name.length > 8
        truncate(lang_name, 5, '.')
      else
        lang_name
      end
    end.join(' / ')
  end

  def format_transcript(text)
    h(text).gsub(/~([^~]*)~/,'<em>\1</em>').sub(/^\s*[A-Z]{2,4}:/,'').strip
  end

end