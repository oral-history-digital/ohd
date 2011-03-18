class Import < ActiveRecord::Base

  belongs_to  :importable,
              :polymorphic => true

  before_create :set_time

  named_scope :for_interview, lambda{|id| {  :conditions => ["importable_type = ? AND importable_id = ?", 'Interview', id],
                                            :limit => "0,1",
                                            :order => "time DESC" }}

  private

  def set_time
    write_attribute :time, Time.now
  end

end