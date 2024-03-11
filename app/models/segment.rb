require 'globalize'

class Segment < ApplicationRecord

  belongs_to :interview, touch: true
  has_one :project, through: :interview

  belongs_to :speaking_person,
    -> { includes(:translations) },
    class_name: 'Person',
    foreign_key: 'speaker_id'

  belongs_to :tape#, inverse_of: :segments

  has_many  :registry_references,
            -> { includes(registry_entry: {registry_names: :translations}, registry_reference_type: {}) },
            :as => :ref_object,
            :dependent => :destroy

  has_many  :registry_entries,
            through: :registry_references

  # NB: Don't use a :dependent => :destroy or :delete
  # on these, as they are user-generated.
  has_many  :user_annotations, as: :reference, dependent: :destroy
  has_many  :annotations, dependent: :destroy

  scope :with_heading, -> {
    where(has_heading: true).
    includes(:translations).
    order(:tape_number, :timecode)}

  scope :mainheadings_until, ->(segment) {
    joins(:translations).
    includes(:translations).
    where("(segment_translations.mainheading IS NOT NULL AND segment_translations.mainheading <> '')").
    where("(timecode <= ? AND tape_number = ?) OR (tape_number < ?)", segment.timecode, segment.tape_number, segment.tape_number).
    where(interview_id: segment.interview_id).
    order(:tape_number, :timecode)}

  scope :subheadings_until, ->(segment, mainheading) {
    joins(:translations).
    includes(:translations).
    where("(segment_translations.subheading IS NOT NULL AND segment_translations.subheading <> '')").
    where("(timecode <= ? AND tape_number = ?) OR (tape_number < ?)", segment.timecode, segment.tape_number, segment.tape_number).
    where("timecode >= ?", mainheading.timecode).
    where("tape_number >= ?", mainheading.tape_number).
    where(interview_id: segment.interview_id).
    order(:tape_number, :timecode)}

  scope :for_media_id, ->(mid) {
    where("segments.media_id < ?", Segment.media_id_successor(mid))
    .order(media_id: :desc)
     .limit(1)
  }

  translates :mainheading, :subheading, :text, touch: true
  accepts_nested_attributes_for :translations

  class Translation
    belongs_to :segment

    after_commit do
      # run this only after commit of original e.g. 'de' version!
      if text_previously_changed? && locale.length == 2 && !text.blank?
        segment.write_other_versions(text, locale)
        segment.translations.where(text: nil).destroy_all # where do these empty translations come from?
      end
      if (mainheading_previously_changed? || subheading_previously_changed?)
        has_heading = !self.class.where("(mainheading IS NOT NULL AND mainheading <> '') OR (subheading IS NOT NULL AND subheading <> '')").
          where(segment_id: segment.id).empty?
        segment.update_attribute(:has_heading, has_heading)
      end
    end
  end

  def write_other_versions(text, locale)
    [:public, :subtitle].each do |version|
      update(text: enciphered_text(version, text, locale), locale: "#{locale}-#{version}")
    end
  end

  def enciphered_text(version, text_original='', locale)
    text_original ||= ''
    text_original = text_original.gsub('{{', '{[').gsub('}}', ']}') # replace wrong {{ with {[
    hidden_text = locale.to_sym == :en ? I18n.t("activerecord.attributes.segment.hidden_text", locale: :en) : I18n.t("activerecord.attributes.segment.hidden_text", locale: :de)
    # TODO: replace with utf8 À
    text_enciphered =
      case version
      when :subtitle
        text_original.
          # colonia
          gsub(/<res\s+(.*?)>/, hidden_text).                    # e.g. <res bla bla>
          gsub(/<an\s+(.*?)>/, "XXX").                           # e.g. <an bla bla>
          gsub(/\s*<n\(([^>]*?)\)>/, "").                        # <n(1977)>
          gsub(/<i\((.*?)\)>/, "").                              # <i(Batteriewechsel)>
          gsub(/<p\d+>/, "").                                    # <p1>, <p2>, ...
          gsub(/<\?\s+(.*?)>/, '(\1?)').                         # e.g. <? bla bla>
          gsub(/<=>/, " ").                                      # <=>
          gsub(/<v\((.+?)\)>/, '').                              # e.g. <v(bla bla)>
          gsub(/<s\((.+?)\)\s*(.*?)>/, '\2').                    # e.g. <s(lachend) bla bla>
          gsub(/<sim\s+(.*?)>/, '\1').                           # e.g. <sim bla bla>
          gsub(/<nl\((.+?)\)\s*(.*?)>/, '\2').                   # e.g. <nl(Geräusch) bla bla>
          gsub(/<g\((.+?)\)\s*(.*?)>/, '\2').                    # e.g. <g(Gestik) bla bla>
          gsub(/<m\((.+?)\)\s*(.*?)>/, '\2').                    # e.g. <m(Mimik) bla bla>
          # zwar
          gsub(/\[.*?\]/, "").                                   # e.g. [Kommentar]
          gsub(/\[\.\.\.\]/, "XXX").                             # e.g. [...]
          gsub(/\s*\([-|\d]+\)/, "").                            # e.g. (-), (---), (6)
          gsub(/\{.*?\}/, "").                                   # e.g. {[laughs silently]}
          gsub("~", "").                                         # e.g. Wo waren Sie ~en este tiempo~?
          #gsub("...", "_").                                      # e.g. ...
          gsub(/\(unverständlich, \d+ \w+\)/, "(...?)").         # e.g. (unverständlich, 1 Wort)
          gsub(/<\?\d+>/, "(...?)").                             # <?1>, <?2>, ...
          gsub(/<l\((.+?)\)\s*(.*?)>/, '\2').                    # e.g. <l(es) bla bla>
          gsub(/<ld\((.+?)\)\s*(.*?)>/, '\2').                   # e.g. <ld(Dialekt) bla bla>
          gsub(" [---]", "").                                    # e.g. Ich war [---] bei Maria Malta, als das passierte.
          gsub("(???) ", "(...?)").                              # e.g. Nice grandparents, we played football, (???) it’s
          gsub("<***>", "").                                     # e.g. <***>
          gsub(/\s+/, " ").                                      # cleanup whitespace (more than one)
          gsub(/\s+([\.\,\?\!\:])/, '\1').                       # cleanup whitespace (before .,?!:)
          gsub(/^\s+/, "")                                       # cleanup whitespace (beginning of phrase)
      when :public
        text_original.
          # colonia
          gsub(/<res\s+(.*?)>/, hidden_text).                    # e.g. <res bla bla>
          gsub(/<an\s+(.*?)>/, "XXX").                           # e.g. <an bla bla>
          gsub(/<n\(([^>]*?)\)>/, '(\1)').                       # <n(1977)>
          gsub(/<i\((.*?)\)>/, "<c(Pause)>").                    # <i(Batteriewechsel)>
          # zwar
          gsub(/\[\.\.\.\]/, "XXX").                             # e.g. <an bla bla>
          gsub(/\{\[?(.*?)\]?\}/, '[\1]').                       # e.g. {[laughs silently]}
          gsub("~", "").                                         # e.g. Wo waren Sie ~en este tiempo~?
          #gsub("...", "_").                                      # e.g. ...
          gsub(" [---]", "<p>").                                 # e.g. Ich war [---] bei Maria Malta, als das passierte.
          #gsub(/\((.*?)\?\)/, '<?\1>').                          # e.g. (By now?) it's the next generation
          gsub("<***>", "<i(Bandende)>").                        # e.g. <***>
          gsub("(???) ", "<?>").                                 # e.g. Nice grandparents, we played football, (???) it’s
          gsub(/\s+/, " ").                                      # cleanup whitespace (more than one)
          gsub(/\s+([\.\,\?\!\:])/, '\1').                       # cleanup whitespace (before .,?!:)
          gsub(/^\s+/, "")                                       # cleanup whitespace (beginning of phrase)
      end
    text_enciphered
  end

  validates_presence_of :timecode#, :media_id

  # TODO: rm this: segments won`t change id any more when platform and archive are joined together?!
  # NOTE: NO UNIQUENESS OF MEDIA_ID!
  # due to segment splitting as captions, the media id can be repeated!!
  # validates_uniqueness_of :media_id
  #validates_format_of :media_id, :with => /\A[a-z]{0,2}\d{3}_\d{2}_\d{2}_\d{3,4}\z/i

  # the following validation is preventing transcript imports in production mode
  # as well as there is an associated interview
  # so for now I comment it
  #validates_associated :interview
  validates_associated :tape

  before_validation :do_before_validation_on_create, :on => :create

  class << self
    def create_or_update_by(opts={})
      segment = find_or_create_by(interview_id: opts[:interview_id], timecode: opts[:timecode], tape_id: opts[:tape_id])
      if opts[:speaker_id]
        next_time = Timecode.new(opts.delete(:next_timecode)).time
        duration = next_time - Timecode.new(opts[:timecode]).time
        opts.update(duration: duration) if duration > 0
        segment.update(opts)
      else
        assign_speakers_and_update_text(segment, opts)
      end
    end

    # this methods substitutes speaker_designations (e.g. *CG:*)
    # if these speaker_designations do not occur at the beginning of the text, a new segment will be created for each occurence
    #
    def assign_speakers_and_update_text(segment, opts)
      tape = Tape.find opts[:tape_id]

      speaker_designations = segment.interview.contributions.map{|d| d.speaker_designation}.reject{|l| l.blank?}
      #
      # regexps with capture groups, e.g. /(speaker one:)|(speaker two:)/
      #
      all_speakers_regexp = Regexp.new(speaker_designations.map{|d| "(#{Regexp.quote(d)})"}.join('|'))

      #
      # splitted_text is an array containing [speaker_designation1, text_of_speaker1, speaker_designation2, text_of_speaker2, etc.]
      #
      splitted_text = segment.interview.contributions.empty? ? [opts[:text]] : opts[:text] && opts[:text].split(all_speakers_regexp).reject(&:empty?)
      time_per_char = calculate_time_per_char(speaker_designations, opts)

      # clean erraneously added blanks
      #while splitted_text.first =~ /^[\n+|\s+]$/
        #splitted_text.shift
      #end

      while splitted_text && !splitted_text.empty?
        atts = {locale: opts[:locale]}
        if splitted_text.length.even?
          speaker_designation = splitted_text.shift
          atts[:text] = splitted_text.shift.gsub(/\n+/, '')
          person_id = segment.interview.contributions.select{|c| c.speaker_designation ==  speaker_designation}.first&.person_id
          atts[:speaker_id] = person_id if person_id
          segment.update atts
        else
          atts[:text] = splitted_text.shift.gsub(/\n+/, '')
          atts[:speaker_id] = segment.prev && segment.prev.speaker_id if !segment.speaker_id && segment.prev && segment.prev.speaker_id
          segment.update atts
        end

        # if there is another speaker_designation in the text
        # check whether there is  an automatically generated segment (from reading in the transcript in another language)
        # or create it
        #
        unless splitted_text.empty?
          next_time = Timecode.new(segment.timecode).time + atts[:text].length * time_per_char
          if segment.next && segment.next.timecode < opts[:next_timecode]
            segment = segment.next
          else
            # if the calculated start-time for the next segment is bigger than the current tape`s time
            # associate to the next tape
            # set time  of next segment to zero or a given shift
            #
            if (next_time.to_f > tape.duration.to_f) && tape.next
              tape = tape.next
              next_time = tape.time_shift
            end
            segment = create(interview_id: opts[:interview_id], tape_id: tape.id, timecode: Timecode.new(next_time).timecode)
          end
        end
      end
    end

    def calculate_time_per_char(speaker_designations, opts)
      # this regexp has  no capture groups!!
      all_speakers_regexp = Regexp.new(speaker_designations.map{|d| Regexp.quote(d)}.join('|'))
      clean_text = opts[:text].gsub(all_speakers_regexp, '').gsub(/\n+/, '')
      duration = Timecode.new(opts[:next_timecode]).time - Timecode.new(opts[:timecode]).time
      duration/clean_text.length
    end

  end

  def languages
    translations.map{|t| t.locale.to_s.split('-').first}.uniq
  end

  def do_before_validation_on_create
    # Make sure we have a tape assigned.
    if self.tape.nil?
      raise "Interview ID missing." if self.interview_id.nil?

      tape_media_id = (self.media_id || '')[Regexp.new("#{project.shortname}\\d{3}_\\d{2}_\\d{2}", Regexp::IGNORECASE)]
      tape = Tape.where({media_id: tape_media_id, interview_id: self.interview_id}).first
      raise "No tape found for media_id='#{tape_media_id}' and interview_id=#{self.interview_id}" if tape.nil?

      self.tape_id = tape.id
    end
  end

  searchable do
    string :archive_id, :stored => true do
      interview.archive_id
    end
    string :media_id, :stored => true
    string :timecode
    string :sort_key
    text :speaker, stored: true do
      speaking_person && speaking_person.name.inject(""){|mem, (k,v)| mem << v; mem}
    end

    boolean :has_heading

    # dummy method, necessary for generic search
    string :workflow_state do
      'public'
    end

    I18n.available_locales.each do |locale|
      text :"text_#{locale}", stored: true do
        text_translations["#{locale}-public"] or nil
      end

      text :"mainheading_#{locale}", stored: true do
        mainheading_translations["#{locale}-public"] or mainheading_translations[locale] or nil
      end

      text :"subheading_#{locale}", stored: true do
        subheading_translations["#{locale}-public"] or subheading_translations[locale] or nil
      end
    end

    # Original text for languages that are not in I18n.available_locales.
    text :"text_orig", stored: true
  end

  I18n.available_locales.each do |locale|
    define_method "text_#{locale}" do
      text("#{locale}-public") # only search in public texts
      # TODO: enable searching over original texts in admin-mode
    end
  end

  def text_orig
    text("#{interview.lang}-public")
  end


  def transcripts(allowed_to_see_all=false)
    translations.inject({}) do |mem, translation|
      # TODO: rm Nokogiri parser after segment sanitation
      mem[translation.locale.to_s] = translation.text #? Nokogiri::HTML.parse(translation.text).text.sub(/^:[\S ]/, "").sub(/\*[A-Z]{1,3}:\*[\S ]/, '') : nil
      mem
    end
  end

  def sort_key
    "#{tape_id}.#{timecode}"
  end

  def orig_locale
    interview.language && ISO_639.find(interview.language.code).alpha2
  end

  def media_id=(id)
    write_attribute :media_id, id.upcase
  end

  def media_id
    (read_attribute(:media_id) || '').upcase
  end

  #
  # only return speaker attribute if no speaker_id is set
  #
  def speaker_designation
    speaker_id.blank? && speaker
  end

  # return a range of media ids up to and not including the segment's media id
  def media_ids_up_to(segment)
    segment = nil if (segment.tape != self.tape) || (segment.media_id < self.media_id)
    media_index = self.media_id[/\d{4}$/].to_i
    base_media_id = self.media_id.sub(/\d{4}$/,'')
    range_size = 2
    unless segment.nil?
      range_size = segment.media_id[/\d{4}$/].to_i - media_index - 1
    end
    ids = [media_id]
    if range_size > 0
      ids << base_media_id + (media_index + range_size).to_s.rjust(4,'0')
    end
    ids
  end

  def time
    @time ||= Timecode.new(timecode).time
  end

  def next
    tape.segments.where("timecode > ?", read_attribute(:timecode)).first
  end

  def prev
    tape.segments.where("timecode < ?", read_attribute(:timecode)).last
  end

  def alias_names
    interview.alias_names || ''
  end

  def as_vtt_subtitles(lang)
    # TODO: rm strip
    segment_text = text_translations["#{lang}-subtitle"] || text_translations["#{lang}-public"]
    end_time = time
    if duration
      end_time += duration
    else
      # if there is no next segment add 7s (approximated segment time)
      end_time = self.next ? self.next.time : self.time + 7
      # lazy update duration
      update duration: end_time - self.time
    end
    "#{Time.at(time).utc.strftime('%H:%M:%S.%3N')} --> #{Time.at(end_time).utc.strftime('%H:%M:%S.%3N')}\n#{segment_text}"
  end

  # returns the segment that leads the chapter
  def section_lead_segment
    Segment.where(["interview_id = ? AND section = ?", interview_id, section]).order(:media_id).first
  end

  def last_heading
    mainheadings = Segment.mainheadings_until(self)
    if mainheadings.count > 0
      mainheadings_count = mainheadings.map{|mh| mh.mainheading("#{interview.languages.first}-public") || mh.mainheading("#{interview.languages.first}-original")}.count
      subheadings = Segment.subheadings_until(self, mainheadings.last)

      if subheadings.count > 0
        interview.project.available_locales.inject({}) do |mem, locale|
          subheading = subheadings.last.subheading(locale) || subheadings.last.subheading("#{locale}-public")
          mem[locale] = "#{mainheadings_count}.#{subheadings.count}. #{subheading}"
          mem
        end
      else
        interview.project.available_locales.inject({}) do |mem, locale|
          mainheading = mainheadings.last.mainheading(locale) || mainheadings.last.mainheading("#{locale}-public")
          mem[locale] = "#{mainheadings_count}. #{mainheading}"
          mem
        end
      end
    else
      {}
    end
  end

  def has_heading?
    !!has_heading
  end

  def self.media_id_successor(mid)
    Segment.media_id_diff(mid, 1)
  end

  def self.media_id_predecessor(mid)
    Segment.media_id_diff(mid, -1)
  end

  def self.media_id_diff(mid, diff)
    mid.sub(/\d{4}$/,(mid[/\d{4}$/].to_i + diff.to_i).to_s.rjust(4,'0'))
  end

  def tape_nbr
    #object.timecode.scan(/\[(\d*)\]/).flatten.first.to_i
    self.tape_number || self.tape.number
  end

  private

  def zero_counts(object)
    object.available_locales.map{ |locale| [locale, 0] }.to_h
  end

  # remove workflow comments
  def filter_annotation(text)
    #text.gsub(/\{[\s{]+[^{}]+[\s}]+\}\s?/,'')
    (text || '').gsub(/\{[\s{]+[^{}]+[\s}]+\}\s?/,'')
  end

  # This is used to reassociate all segment-based user_content,
  # i.e. user_annotations and their annotations.
  def reassign_user_content
    # As we don't know the subsequent segments media_id yet,
    # theoretically all the trailing annotations would have to
    # be assigned to each segment, so that annotations on the last
    # segment get assigned to each of the interviews segments in turn.
    # To avoid this, I'm using an arbitrary media_id range of media_id..media_id+12
    # which in practice should be safe for reassigning to the correct segment, while
    # minimizing subsequent reassignments.
    UserAnnotation.where(["media_id >= ? AND media_id < ?", media_id, Segment.media_id_diff(media_id, 12)]).
      includes(:annotation).find_each do |user_annotation|
        user_annotation.update_attribute :reference_id, self.id
        unless user_annotation.annotation.nil?
          user_annotation.annotation.update_attribute :segment_id, self.id
        end
      end
  end

end
