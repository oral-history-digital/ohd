class AddSpacesToPersonNames < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      RegistryName::Translation.where("descriptor RLIKE ?", ".+,.+").each do |t|
        t.descriptor = t.descriptor.split(",").map{|n| n.strip}.join(", ")
        t.save
      end
    end
  end
end
