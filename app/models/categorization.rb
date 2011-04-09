class Categorization < ActiveRecord::Base

  belongs_to :category
  belongs_to :interview

  validates_uniqueness_of :interview_id, :scope => :category_id

  # May only have one singular category associated
  validates_uniqueness_of :category_type, :scope => :interview_id, :if => Proc.new{|c| Category::SINGULAR_CATEGORIES.include?(c.category_type)}
  
end
