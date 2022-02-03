class InstitutionProject < ApplicationRecord
  belongs_to :institution, touch: true
  belongs_to :project, touch: true
end
