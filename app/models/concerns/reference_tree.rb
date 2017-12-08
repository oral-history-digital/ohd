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

  def create_node(node_id)
    {
      id: node_id,
      type: 'node',
      desc: RegistryEntry.find(node_id).localized_hash,
      children: []
    }
  end

  def find_or_create_node(array, node_id)
    result = array.select{|node| node[:id] == node_id}.first
    unless result
      result = create_node(node_id)
      array << result
    end
    result
  end

  def deep_find_or_create_node(array, node_id)
    result = deep_find_node(array, node_id) 
    unless result
      result = create_node(node_id)
      #array << result
    end
    result
  end

  def deep_find_node(array, node_id)
    result = array.select{|node| node[:id] == node_id}.first 
    unless result
      array.each do |node|
        result = deep_find_node(node[:children], node_id) if node[:children]
        return result if result
      end
    end
    result 
  end

  def leafes_with_parent_nodes
    parent_nodes = []
    segment_registry_references.each do |ref| 
      node = find_or_create_node(parent_nodes, ref.registry_entry_id)
      node[:children] << leafe(ref.ref_object)
    end
    parent_nodes
  end

  def prepend_parents(nodes)
    parent_nodes = []
    nodes_without_parents_count = 0

    until nodes.empty?
      node = nodes.shift
      parent = RegistryEntry.find(node[:id]).parents.first

      if parent 
        parent_node = deep_find_node(parent_nodes, parent.id) || deep_find_node(nodes, parent.id)
        unless parent_node
          parent_node = create_node(parent.id) 
          parent_nodes << parent_node
        end
        parent_node[:children] << node
      else
        p "*** node #{node[:id]} has no parents!"
        nodes_without_parents_count += 1
        parent_node = parent_nodes.select{|p| p[:id] == node[:id]}.first
        if parent_node
          parent_nodes[:children] = parent_node[:children] + node[:children]
        else
          parent_nodes << node 
        end
      end
    end
    p "*** parent_nodes length = #{parent_nodes.length}"
    binding.pry
    if parent_nodes.length == nodes_without_parents_count
      parent_nodes
    else
      prepend_parents(parent_nodes)
    end
  end

  def ref_tree
    prepend_parents(leafes_with_parent_nodes)
  end

  class_methods do
  end
end
