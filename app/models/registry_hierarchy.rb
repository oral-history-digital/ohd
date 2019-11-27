require 'acts-as-dag'

class RegistryHierarchy < ActiveRecord::Base
  acts_as_dag_links :node_class_name => 'RegistryEntry'

  after_create :touch_objects
  before_destroy :touch_objects

  def destroy_or_make_indirect
    if destroyable?
      destroy
    else
      make_indirect
      save
    end
  end

  def touch_objects
    ancestor && ancestor.touch
    descendant && descendant.touch
  end


end
