class MvSignatureOriginalToSeperateColumn < ActiveRecord::Migration[5.2]
  def change
    add_column :interviews, :signature_original, :string
    Interview.where.not(properties: nil).find_each(batch_size: 200) do |interview|
      interview.update_attributes signature_original: interview.properties[:signature_original]
    end
  end
end
