# This is the XML:SAX:Document class for captions parsing
require 'nokogiri'

class CaptionsSegments < Nokogiri::XML::SAX::Document

  def start_document
    @segments_found = 0
    @segments_imported = 0
    @sections_imported = 0
    @tape_media_id = nil
    @section = 0
    @segment = nil
    @characters = ''
    puts "begin parsing..."
  end

  def start_element(element, raw_attributes)
    if element == 'segment'
      @segments_found += 1

      attributes = {}
      attribute_key = nil
      raw_attributes.each_with_index do |attr,index|
        if index % 2 == 0
          attribute_key = attr
        else
          attributes[attribute_key] = attr
        end
      end

      #puts "\nAttributes for segment:\n #{attributes.inspect}\n"

      # create or update a Segment
      unless attributes['timecode'].nil? || attributes['media_id'].nil?

        tape_media_id = (attributes['media_id'] || '')[/^\w{2}\d{3}_\d{2}_\d{2}/].upcase
        # check if we have the correct tape
        unless @tape_media_id == tape_media_id
          @tape = Tape.find_by_media_id tape_media_id
          @tape_media_id = tape_media_id
          @speaker = nil
          old_segment_number = Segment.delete_all "media_id REGEXP '#{tape_media_id.upcase}'"
          puts "\ndeleted #{old_segment_number} previously imported segments prior to import."
        end

        # save the previous segment
        save_segment

        # get or initialize the segments
        @segment = Segment.find_or_initialize_by_timecode_and_tape_id(attributes['timecode'], @tape.id)
        @segment.media_id = attributes['media_id']
        @segment.section = (attributes['section'] || '')[/\d{1,2}\.{0,1}\d{0,2}/]
        unless @section == @segment.section
          @segment.chapter_change = true
          @section = @segment.section
        end

      end
    end
  end

  # capture the characters
  def characters(string)
    @characters << string
  end

  # read the captured characters at the end of an element
  def end_element(element)
    case element
    when 'transcript'
      @segment.transcript = @characters

    when 'translation'
      @segment.translation = @characters

    when 'mainheading'
      @segment.mainheading = @characters
      @sections_imported += 1

    when 'subheading'
      @segment.subheading = @characters
      @sections_imported += 1

    when 'speaker'
      @segment.speaker = @characters
      unless @speaker == @segment.speaker
        @segment.speaker_change = true
        @speaker = @segment.speaker
      end

    when 'segments'
      save_segment
    end
    @characters = ''
  end


  def end_document
    puts
    puts "found #{@segments_found} segments, imported #{@segments_imported} segments and #{@sections_imported} sections."
    puts "done."
  end

  private

  def save_segment
    unless @segment.nil?
      begin
        STDOUT.printf '.' if @segment.save! && (@segments_imported % 10 == 0)
      rescue Exception => e
        puts "#{e.message}"
        puts "ERRORS: #{@segment.errors.full_messages}\nINSPECT: #{@segment.inspect}\n" unless @segment.valid?
      end
      STDOUT.flush
      @segments_imported += 1
    end
  end

end
