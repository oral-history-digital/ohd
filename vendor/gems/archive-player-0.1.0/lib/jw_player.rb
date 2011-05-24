#TODO: copy plus, minus images

class JWPlayer

  # these options are archive-player specific and
  # not part of the standard jw player configuration
  ARCHIVEPLAYER_SPECIFIC_OPTIONS = [ :position, :on_segment, :segment_file, :segments_plugin, :images, :hd_plugin, :hd_state ]

  ARCHIVEPLAYER_CONFIG = {
          :flashplayer            => '/swf/player.swf',
          :allowfullscreen        => 'true',
          :wmode                  => 'transparent',
          :width                  => 400,
          :height                 => 300,
          :autostart              => false,
          :repeat                 => 'list',
          :controlbar             => 'bottom',
          :images                 => {
                  :heading_open         => '/images/plus.gif',
                  :heading_close        => '/images/minus.gif',
                  :mute                 => '/images/player_speaker_mute_n.gif',
                  :mute_hover           => '/images/player_speaker_mute_a.gif',
                  :unmute               => '/images/player_speaker_n.gif',
                  :unmute_hover         => '/images/player_speaker_a.gif',
                  :volume_blank         => '/images/volume_blank.gif'
          }
  }

  included_modules.include?(ActionView::Helpers) || include(ActionView::Helpers)

  def initialize(file, config = {})
    # object specific configuration
    @container = (config[:id] ? config.delete(:id) : "mediaplayer-#{self.object_id.to_s.gsub(/\D/, '')}")
    @root_path = config.delete(:root_path)

    # merge default settings and application wide configuration
    #unless defined?(@@app_wide_config)
    #TODO: @@@app_wide_config OK
    app_player_config_file = (defined?(RAILS_ROOT) && File.exists?(File.join(RAILS_ROOT, 'config/player.yml'))) \
            ? File.join(RAILS_ROOT, 'config/player.yml') \
            : File.join(File.dirname(__FILE__), '../config/player.yml')
    if File.exists?(app_player_config_file)
      @@app_wide_config = YAML::load_file(app_player_config_file).symbolize_keys!
    end
    #end

    player_definition = (config.delete(:definition) || :default).to_sym
    player_definition = :default unless @@app_wide_config.keys.include?(:player_definition)

    @options = ARCHIVEPLAYER_CONFIG.dup
    unless @@app_wide_config[player_definition].nil?
      @options = @@app_wide_config[player_definition].symbolize_keys!.merge(config)
    end
    @options.each_value do |option|
      option.symbolize_keys! if option.class == Hash
    end

    # media or playlist file
    @options[:file] = file

    # handle plugins
    #TODO: player not loading when empty!
    plugin_options = []
    unless @options.delete(:segments_plugin) === false
      plugin_options << (@options[:segments] ? @options[:segments].delete(:plugin_file) : nil) || "segments.swf"
    end
    unless @options.delete(:hd_plugin) === false
      plugin_options << (@options[:hd] ? @options[:hd].delete(:plugin_file) : nil) || "hd.swf"
    end
    plugin_options.concat(@options.delete(:plugins).split(',')) if @options[:plugins]
    plugin_options.collect! do |plugin|
      plugin.rstrip! unless plugin == nil
      plugin =~ /\.swf$/ ? swf_path(plugin) : plugin
    end
    @options[:plugins] = plugin_options.join(',')

    # handle root path to assets
    [ :flashplayer, :skin ].each do |asset_file_option|
      @options[asset_file_option] = swf_path(@options[asset_file_option]) unless @options[asset_file_option].nil?
    end

    @options[:images].each do |image_file|
      @options[:images][image_file] = images_path(@options[:images][image_file]) unless @options[:images][image_file].nil?
    end

    # hd plugin translations
    if @options[:hd]
      ['on', 'off'].each do |state|
        @options[:hd][("text#{state}").to_sym] = I18n.t(("hd_#{state}").to_sym, :scope => 'archive_player.controls')
      end
    end
  end

  def container_id
    @container
  end

  # Heading Hash
  def headings_container headings_hash
    unless headings_hash.empty?
      content = '<table id="interview_headings" class="mainheadings">'
      content << '<tbody>'
      headings_hash.keys.sort.each_with_index do |section, index|
      mainheading = headings_hash[section]
        content_id = "#{mainheading[:id]}"
        content << "<tr id='#{content_id}' class='mainheading#{mainheading[:subheadings].empty? ? '' : ' closed'}'>"
        content << "<td class='section'#{mainheading[:subheadings].empty? ? '' : " onclick=\"headings.toggleSection(#{index+1});\""}>#{section}</td>"
        content << '<td class="heading">'
        timecode_tag = content_tag(:span, "#{mainheading[:timecode]}", :class => 'timecode')
        content << link_to_position("#{mainheading[:title]}#{timecode_tag}", mainheading[:item], mainheading[:pos])
        content << "<ul id='subheadings_for_#{section}' class='subheadings'>"
        mainheading[:subheadings].each_with_index do |subheading, index|
          content_id = "#{subheading[:id]}"
          content << "<li id='#{content_id}' class='subheading'>"
          timecode_tag = content_tag(:span, "#{subheading[:timecode]}", :class => 'timecode')
          content << link_to_position("#{section}.#{index + 1} #{subheading[:title]}#{timecode_tag}", "#{subheading[:item]}", "#{subheading[:pos]}")
          content << '</li>'
        end
        content << '</ul>'
        content << '</td>'
        content << '</tr>'
      end
      content << '</tbody>'
      content << '</table>'
      # set the id and style on the parent container
      #TODO: include parent container here
      js = "var hC = $('interview_headings').up(); hC.id = '#{@container}-headings';"
      js << "hC.setStyle({overflowY: 'scroll', overflowX: 'hidden'});"
      js << "headings = new TableOfContents({id: '#{@container}-headings'});"
      content << javascript_tag(js)
    end
  end

  def link_to_position(text, item, position)
    link_to_function text, "archiveplayer('#{@container}').seek(#{item}, #{position})", :class => "heading"
  end

  # displays the player
  def to_s
    container
  end

  def segments_container_for(attribute, tag = 'div', properties = {})
    properties.delete('id')
    properties[:id] = segments_container = segments_container_id_for(attribute)
    content = ''
    if properties.delete(:slides)
      3.times { |i| content << content_tag(:div, '&nbsp;', { :id => "#{segments_container}-#{i}", :class => 'captions-slide' }) }
      content << javascript_tag("archiveplayer('#{@container}').activateSlidesFor('#{segments_container}', '#{attribute}')")
    end
    content_tag(tag, content, properties)
  end

  def segments_container_id_for(attribute)
    "#{@container}-segments-#{attribute}"
  end

  def link_to_next_segment(content = nil)
    link_to_function((content || I18n.t(:next_segment, :scope => 'archive_player.controls')), "archiveplayer('#{@container}').seekNextSegment()")
  end

  def link_to_previous_segment(content = nil)
    link_to_function((content || I18n.t(:previous_segment, :scope => 'archive_player.controls')), "archiveplayer('#{@container}').seekPreviousSegment()")
  end

  # select list for items
  def items_selector items_size
    unless items_size == 0
      select_tag(
        "#{container_id}-item-selector",
        options_for_select((1..items_size).collect{ |item| ["#{item.to_s} #{I18n.t(:of, :scope => 'archive_player.controls')} #{items_size}", (item-1).to_s] }),
        :onChange => "jwplayer('#{container_id}').playlistItem(this.value);"
      )
    else
      content_tag(:span, '&mdash;')
    end
  end

  def mute_control
    content_tag(:span,
                link_to_function(image_tag('player_speaker_n.gif', :id => "#{@container}-mute-image"),
                                 "archiveplayer('#{container_id}').toggleMute();",
                                 :onmouseover => "archiveplayer('#{@container}').changeMuteImage(true);",
                                 :onmouseout => "archiveplayer('#{@container}').changeMuteImage(false);"),
                :class => "archiveplayer-mute-button",
                :id => "#{@container}-mute-button" )
  end

  def volume_control
    content =  content_tag(:div, '', { :id => "#{container_id}-volumebar", :style => 'position: absolute; top: 0; left: 0; width: 80%; height: 100%; background-color: #999999; margin: 0; padding: 0;' })
    content << image_tag('volume_blank.gif', :width => '100%', :height => '100%', :id => "#{container_id}-volume", :style => 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10;')
    content << javascript_tag("archiveplayer('#{container_id}').volumeClickListener();")
    content_tag(:div, content, { :style => 'position: relative; background-color: #730f0f; width: 50px; height: 8px; padding: 0; margin: 0;' })
  end

  def self.js_camelize(text)
    "#{text.to_s.camelize.sub(/^.{1}/,text.to_s.first)}"
  end

  protected

  def images_path(file, images_root='images')
    File.join(@root_path || "", images_root, file.sub(Regexp.new("^/?#{images_root}"),''))
  end

  def swf_path(file, swf_root='swf')
    File.join(@root_path || "", swf_root, file.sub(Regexp.new("^/?#{swf_root}"),''))
  end

  def container
    no_script = no_script_container
    content = content_tag('div', I18n.t(:flash_required, :scope => 'archive_player.messages') + "<br>" + no_script, :id => "#{@container}")
    javascript = "archiveplayer('#{@container}').setup({ #{js_options[:jwplayer]} }, { #{js_options[:specific]} });"
    content_tag('div', content, :id => "#{@container}-wrapper") << javascript_tag(javascript)
  end

  #TODO: no script embedding
  def no_script_container
    content_tag 'noscript', I18n.t(:javascript_required, :scope => 'archive_player.messages')
  end

  # won't work for events.onSegments
  def js_options
    js_options = { :specific => [], :jwplayer => [] }
    js_events = { :specific => [], :jwplayer => [] }

    @options.each do |key, value|
      if(key == :events && value.class == Hash) # event listeners
        value.each do |sub_key, sub_value|
          option_type = :jwplayer
          key_name = "#{JWPlayer.js_camelize(sub_key)}"
          if ARCHIVEPLAYER_SPECIFIC_OPTIONS.include? key
            option_type = :specific if ARCHIVEPLAYER_SPECIFIC_OPTIONS[key].include? sub_key
          end
          js_events[option_type] << "'#{key_name}': #{sub_value}"
        end
      elsif value.class == Hash # e.g. 'hd.state'
        value.each do |sub_key, sub_value|
          option_type = :jwplayer
          key_name = "#{JWPlayer.js_camelize(key)}.#{JWPlayer.js_camelize(sub_key)}"
          if ARCHIVEPLAYER_SPECIFIC_OPTIONS.include? key
            option_type = :specific # if ARCHIVEPLAYER_SPECIFIC_OPTIONS[key].include? "sub_key"
          end
          js_options[option_type] << "'#{key_name}': '#{sub_value}'"
        end
      else # e.g. 'fullscreen'
        option_type = :jwplayer
        key_name = "#{JWPlayer.js_camelize(key)}"
        option_type = :specific if ARCHIVEPLAYER_SPECIFIC_OPTIONS.include? key
        js_options[option_type] << "'#{key_name}': '#{value}'"
      end
    end

    # events
    js_events.each do |option_type, events|
      unless js_events[option_type].empty?
        js_options << "'events': { #{js_events[option_type].join(', ')} }"
      end
    end

    joined_options = {}
    js_options.each { |option_type, options| joined_options[option_type] = options.join(', ')}
    joined_options
  end

end