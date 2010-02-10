module InterviewHelper

  # transforms the headings array into a hash structure
  # which renders the hierarchy better
  def hashed_headings_from_array(headings)
    headings_hash = {}

    current_mainheading = nil
    section_number = 0

    headings.each do |heading|
      # values for the player seeking
      player_item = (heading.tape.number-1).to_s
      player_pos = heading.segment.start_time.round.to_s
      # html
      heading_id = "heading_" + player_item + "_" + player_pos

      if heading.mainheading
        section_number = headings_hash.keys.size + 1
        headings_hash[section_number] = {
                :title => heading.title,
                :item => player_item,
                :pos => player_pos,
                :id => heading_id,
                :subheadings => []
        }
      elsif section_number > 0
        # add the subheading to the current mainheading
        headings_hash[section_number][:subheadings] << {
                :title => heading.title,
                :item => player_item,
                :pos => player_pos,
                :id => heading_id
        }
      end
    end

    headings_hash
  end

end