class AddPropertiesToSavedSearches < ActiveRecord::Migration[5.2]
  def change
    UserContent.where(type: 'Search').each do |uc|
      if uc.properties['query_hash'] || uc.properties['query']
        uc.properties.delete 'query_hash'
        uc.properties["page"] = 1
        uc.properties["forced_labor_groups[]"] = uc.properties['query']['forced_labor_groups'] || []
        uc.properties["forced_labor_fields[]"] = uc.properties['query']['forced_labor_fields'] || []
        uc.properties["fulltext"] = uc.properties['query']['fulltext'] || ''
        uc.properties.delete 'query' 
        uc.save
      end
    end
  end
end
