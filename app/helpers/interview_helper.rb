module InterviewHelper

  # Limits the number of displayed characters and adds a 'more' link
  # to expand the content.
  def expand(content, id=('field_' + (@expanded_fields = (@expanded_fields ||=0)+1).to_s), limit=190)
    if content.length < limit+1
      content
    else
      teaser = truncate(content, limit)
      teaser_id = id + '_teaser'
      full_id = id + '_full'
      more_link = link_to_function(t(:more, :scope => 'user_interface.labels') + '&nbsp;&raquo;', "$('#{teaser_id}').hide(); new Effect.BlindDown('#{full_id}');")
      html = content_tag(:span, teaser + more_link, :id => teaser_id)
      less_link = link_to_function('&laquo;&nbsp;' + t(:less, :scope => 'user_interface.labels'), "$('#{full_id}').hide(); $('#{teaser_id}').show();")
      html << content_tag(:span, content + less_link, :id => full_id, :style => 'display: none;')
    end
  end

  # transforms the headings array into a hash structure
  # which renders the hierarchy better
  def hashed_headings_from_array(headings)
    headings_hash = {}

    section_number = 0

    headings.each do |heading|
      # values for the player seeking
      player_item = (heading.tape.number-1).to_s
      player_pos = heading.start_time.floor.to_s
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

  def format_date(text)
    time = text.strip.split(/[.-]/)
    if time.empty?
      t(:unknown, :scope => 'status')
    else
      year = time.shift
      month = time.shift
      day = time.shift
      unless month.nil?
        month = t(%w(Jan Feb Mar Apr Mai Jun Jul Aug Sep Okt Nov Dez)[month.to_i-1], :scope => 'months')
      end
      day = day.to_i.to_s + '.' unless day.nil?
      [day, month, year].compact.join('&nbsp;')
    end
  end

  def interview_player(interview)
    JWPlayer.new(playlist_interview_tapes_path(interview, :format => :xml),
                             :id => 'interview-player',
                             :item => (params[:item] != nil ? (params[:item].to_i-1) : nil),
                             :position => (params[:position] != nil ? params[:position] : nil),
                             :hd_plugin => interview.video?)
  end

end