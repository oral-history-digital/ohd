class Categorization < ActiveRecord::Base

  belongs_to :category
  belongs_to :interview

  validates_uniqueness_of :interview_id, :scope => :category_id
  
end
