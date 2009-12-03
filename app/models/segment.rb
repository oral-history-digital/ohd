class Segment < ActiveRecord::Base

  belongs_to :tape

  delegate  :interview,
            :to => :tape

  Category::ARCHIVE_CATEGORIES.each do |category|
    self.class_eval <<DEF
    def #{category.first.to_s.singularize}_ids
      interview.#{category.first.to_s.singularize}_ids
    end
DEF
  end

  
  validates_presence_of :timecode
  validates_presence_of :media_id
  validates_format_of :media_id, :with => /^[a-z]{0,2}\d{3}_\d{2}_\d{2}_\d{3,4}$/i


  searchable :auto_index => false do
    string :archive_id, :stored => true
    string :media_id, :stored => true
    text :transcript, :translation
    Category::ARCHIVE_CATEGORIES.each do |category|
      integer((category.first.to_s.singularize + '_ids').to_sym, :multiple => true, :stored => true, :references => Category )
    end
    string :person_name, :using => :full_title, :stored => true
  end

  def interview_id
    interview.id
  end

  def archive_id
    @archive_id || interview.archive_id
  end

  def archive_id=(code)
    @archive_id = code
  end

  def language_id
    interview.language_id
  end

  def full_title
    interview.full_title
  end

  def transcript
    filter_annotation read_attribute(:transcript)
  end

  def translation
    filter_annotation read_attribute(:translation)
  end

  private

  # remove workflow comments
  def filter_annotation(text)
    text.gsub(/\{[^{}]+\}/,'')
  end


end