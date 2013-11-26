module InterviewHelper

  # Limits the number of displayed characters and adds a 'more' link
  # to expand the content.
  def expand(content, id=('field_' + (@expanded_fields = (@expanded_fields ||=0)+1).to_s), limit=150)
    if content.length < limit+81
      content
    else
      teaser = truncate(content, :length => limit)
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
  def hashed_headings_from_array(segments_with_heading)
    headings_hash = {}

    section_number = 0

    segments_with_heading.each do |segment_with_heading|
      # values for the player seeking
      player_item = (segment_with_heading.tape.number - 1).to_s
      player_pos = segment_with_heading.start_time.floor.to_s
      # html
      heading_id = "heading_" + player_item + "_" + player_pos

      unless segment_with_heading.mainheading(I18n.locale).blank?
        section_number = headings_hash.keys.size + 1
        headings_hash[section_number] = {
            :title => segment_with_heading.mainheading(I18n.locale),
            :item => player_item,
            :timecode => segment_with_heading.raw_timecode.to_s,
            :pos => player_pos,
            :id => heading_id,
            :subheadings => []
        }
      end
      unless segment_with_heading.subheading(I18n.locale).blank? || headings_hash[section_number].nil?
        # add the subheading to the current mainheading
        headings_hash[section_number][:subheadings] << {
            :title => segment_with_heading.subheading(I18n.locale),
            :item => player_item,
            :timecode => segment_with_heading.raw_timecode.to_s,
            :pos => player_pos,
            :id => heading_id
        }
      end
    end

    headings_hash
  end

  def citation_for(citation, translated=false)
    html = ''
    text = translated ? citation[:translated] : citation[:original]
    unless(text.to_s).strip.blank?
      item = citation[:item]
      position = citation[:position]
      unless item.nil? || position.nil?
        html = link_to_function '&raquo;&nbsp;' + t(:goto_citation, :scope => 'user_interface.player'), "archiveplayer('interview-player').seek(#{item-1},#{position});"
      end
      html = content_tag(:span, text.to_s + html, :class => "citation")
      # (link_to '&raquo;&nbsp;' + t(:goto_citation, :scope => 'user_interface.player'), '#', :class => "segment-navigation"), :class => "citation")
    end
    html
  end

  # formats the languages for the transcript language tabs
  def formatted_languages(interview)
    truncate_language_names = interview.languages.size > 1
    interview.languages.map do |lang|
      lang_name = t(lang, :scope => 'mediaplayer.languages')
      if truncate_language_names && lang_name.length > 8
        truncate(lang_name, :length => 5, :omission => '.')
      else
        lang_name
      end
    end.join(' / ')
  end

  def format_transcript(text)
    h(text).gsub(/[~*]([^~*]*)[~*]/,'<em>\1</em>').gsub(/\s+([.,?;])/,'\1').strip
  end

  def location_to_param(name)
    (name || '').gsub(/[\s,;]+/,'+')
  end

  def deportation_for(interview)
    unless interview.deportation_location.blank?
      [ interview.deportation_location, format_date(interview.deportation_date) ].compact.join(',&nbsp;')
    else
      t(:not_deported, :scope => 'status')
    end
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

  def interview_direction(interview)
    interview.right_to_left ? 'RTL' : 'LTR'
  end

  def spaced_apart_segments(list_of_segments)
    time = '[1] 00:00:00'
    segments = []
    list_of_segments.each do |seg|
      segments << seg if (Timecode.diff(time, seg.timecode).abs > 60)
      time = seg.timecode
    end
    segments
  end

end
