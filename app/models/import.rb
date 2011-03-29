class Import < ActiveRecord::Base

  belongs_to  :importable,
              :polymorphic => true

  before_create :set_time, :set_current_migration

  named_scope :last, { :limit => "0,1", :order => "time DESC" }

  named_scope :for_interview, lambda{|id| {  :conditions => ["importable_type = ? AND importable_id = ?", 'Interview', id],
                                            :limit => "0,1",
                                            :order => "time DESC" }}

  def self.current_migration
    @@current_migration ||= begin
      last_migration_import = Import.find :first, :order => "migration DESC"
      last_migration_import.nil? ? '00000000000000' : last_migration_import.migration
    end
  end

  def self.current_migration=(migration)
    @@current_migration = migration if migration.is_a?(String) && migration =~ /^\d+$/
  end

  def time=(time)
    @time = time
  end

  private

  def set_time
    time_of_import = begin
      case @time
        when String
          Time.parse @time
        when Time, Datetime
          @time
        else
          Time.now
      end
    end
    write_attribute :time, time_of_import
  end

  def set_current_migration
    unless @@current_migration.nil? || @@current_migration > migration
      @@current_migration = migration
    end
  end

end