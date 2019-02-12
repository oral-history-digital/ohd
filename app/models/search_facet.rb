class SearchFacet < ApplicationRecord

  belongs_to :facet,
    polymorphic: true

  belongs_to :project

end
