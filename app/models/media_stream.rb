class MediaStream < ApplicationRecord
  belongs_to :project, touch: true
end
