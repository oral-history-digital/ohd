require 'active_support/concern'

module ReferenceTree
  extend ActiveSupport::Concern

  included do
  end

  def leafe(segment)
    {
      type: 'leafe',
      start_time: segment.start_time
    }
  end

  def node(key, value)
    {
      type: 'node',
      desc: RegistryEntry.find(key).descriptor(:all),
      children: [value]
    }
  end

  def leafes
    if @leafes
      @leafes
    else
      @leafes = {}
      segment_registry_references.each do |ref| 
        if @leafes[ref.registry_entry_id] 
          @leafes[ref.registry_entry_id][:children] << leafe(ref.ref_object)
        else
          @leafes[ref.registry_entry_id] = node(ref.registry_entry_id, leafe(ref.ref_object))
        end
      end
      @leafes
    end
  end

  def prepend_parents(tree)
    nodes = {}
    tree.each do |key,value|
      if nodes[key]
        nodes[key][:children] << value
      else
        nodes[key] = node(key, value)
      end
    end
    if nodes.length == 1
      nodes
    else
      prepend_parents(nodes)
    end
  end

  def get_ref_tree
    prepend_parents(leafes)
  end

  class_methods do
  end
end
