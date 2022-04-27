class ArchivingBatch < ApplicationRecord
  belongs_to :project
  has_and_belongs_to_many :interviews

  validates :number, presence: true, uniqueness: { scope: :project_id }
  validates :project, presence: true

end
