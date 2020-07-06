class FixRegistryEntryLatitude < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :zwar
      re = RegistryEntry.where("latitude LIKE ?", '%Hamburg%').first
      re && re.update_attributes(latitude: "10.1070")
    end
  end
end
