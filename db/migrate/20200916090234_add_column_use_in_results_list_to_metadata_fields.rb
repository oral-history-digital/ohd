class AddColumnUseInResultsListToMetadataFields < ActiveRecord::Migration[5.2]
  def change
    add_column :metadata_fields, :use_in_results_list, :boolean
  end
end
