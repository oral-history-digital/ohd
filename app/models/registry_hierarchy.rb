require 'acts-as-dag'

class RegistryHierarchy < ActiveRecord::Base
  acts_as_dag_links :node_class_name => 'RegistryEntry'

  def destroy_or_make_indirect
    if destroyable?
      destroy
    else
      make_indirect
      save
    end
  end

end
