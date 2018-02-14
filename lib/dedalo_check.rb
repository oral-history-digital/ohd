module DedaloCheck
    def validate_ref_tree
      is_valid = true
      if Project.name.to_sym == :mog
        # check periods
        if !RegistryEntry.where(entry_dedalo_code: "hierarchy1_246").first.entry_code == "periods"
          RegistryEntry.where(entry_dedalo_code: "hierarchy1_246").first.update_attribute :entry_code, 'periods'
          puts "updated entry_code for RegistryEntry.where(entry_dedalo_code: 'hierarchy1_246)' to 'periods'"
        end
        # check thematic
        if RegistryEntry.where(entry_dedalo_code: "ts1_1").first.id != Project.ref_tree_nodes['thematic']['id']
          puts "Project.ref_tree_nodes['thematic']['id'] is #{Project.ref_tree_nodes['thematic']['id']}"
          puts "RegistryEntry.where(entry_dedalo_code: 'ts1_1').first.id is #{RegistryEntry.where(entry_dedalo_code: "ts1_1").first.id}"
          puts "Change Project.ref_tree_nodes['thematic']['id'] in config/projects/mog.yml to #{RegistryEntry.where(entry_dedalo_code: "ts1_1").first.id}"
          is_valid = false
        end
      end
      return is_valid
    end
end