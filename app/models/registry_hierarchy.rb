require 'acts-as-dag'

class RegistryHierarchy < ActiveRecord::Base
  acts_as_dag_links :node_class_name => 'RegistryEntry'
end
