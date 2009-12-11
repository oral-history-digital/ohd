# The TapeResegmenter is a class that can perform
# various reformatting and resegmenting tasks across
# a segmented tape.
#
# There are four tasks that are performed in order:
#
# 1. Duration: extract segment duration info
# 2. Speaker: extract speaker info at start of segment
# 3. Splitting & Merging: split according to length constraints and
#       speaker changes inside segments, and merge segments according
#       to length, prevent merging on speaker or chapter change
#
# The TapeResegmenter works on DB data and will not change
# the contents on a rerun of the same task on the same segments
#
# Segment Media ID will be kept according to the old standard, and
# will represent the starting segment Media ID. Split segments will
# have the same Media ID.


class TapeResegmenter

  BLOCK_SIZE = 25

  MAX_SEGMENT_LENGTH = 300

  # initializes an instance on a tape
  def initialize(tape)
    @tape = tape.is_a?(Tape) ? tape : (tape.is_a?(String) ? Tape.find_by_media_id(tape) : Tape.find(tape))
    raise "No tape found for #{tape}" if @tape.nil?
    @segment_block = []
    @last_segment = nil
  end

  # Step One: calculation of the segments' duration.
  def calculate_duration!

  end

  # Step Two: allocates a speaker to each segment.
  def allocate_speaker!

  end

  # Step Three: splits segments into parts that
  # fit into the maximum segment size and merges
  # them with the preceding segments (except on
  # speaker change or chapter change).
  def resize_segments!

  end

  private

  # performs an action across a block by
  # iterating across all segments
  def block_process(&proc)

  end

  # reads the next segment block from DB
  def read_block

  end

  # writes the current segment block to DB
  def write_block

  end

end