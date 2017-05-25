class Import < ActiveRecord::Base

  CONTENT_ITEMS = %w(tapes segments annotations contributions photos text_materials registry_entries registry_references)

  belongs_to  :importable,
              :polymorphic => true

  before_create :set_time, :set_current_migration

  # Active Record already defined a class method with the same name.
  #
  # scope :last, -> { limit("0,1").order("time DESC") }

  scope :for_interview, ->(id){ where(["importable_type = ? AND importable_id = ?", 'Interview', id]).
                                limit("0,1").
                                order("time DESC") }

  scope :recent_for, ->(type) { where(["importable_type = ? AND created_at > ?", type, (Time.now - 1.week).to_s(:db)]).includes(:importable).order("created_at DESC") }

  def self.current_migration
    @@current_migration ||= begin
      last_migration_import = Import.first.order("migration DESC")
      last_migration_import.nil? ? '00000000000000' : last_migration_import.migration
    end
  end

  def self.current_migration=(migration)
    @@current_migration = migration if migration.is_a?(String) && migration =~ /^\d+$/
  end

  def time=(time)
    @time = time
  end

  def content=(hash)
    content = {}
    hash.keys.each do |k|
      next if %(interviews collections).include?(k.to_s)
      content[k.to_sym] = hash[k].compact.size
    end
    write_attribute :content, content.to_yaml
  end

  def content
    YAML.load(read_attribute(:content) || '')
  end

  private

  def set_time
    time_of_import = begin
      case @time
        when String
          Time.parse @time
        when Time, DateTime
          @time
        else
          Time.now
      end
    end
    write_attribute :time, time_of_import
  end

  def set_current_migration
    unless !defined?(@@current_migration) || @@current_migration > migration
      @@current_migration = migration
    end
  end

end
