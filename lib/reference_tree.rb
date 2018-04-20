class ReferenceTree

  def initialize(registry_references)
    @registry_references = registry_references
    @tree = prepend_parents(leafes_with_parent_nodes)
  end

  def full
    prepend_parents(leafes_with_parent_nodes)
  end

  def part(node_id)
    deep_find_node(@tree, node_id)[0]
  end

  def full
    @tree
  end

  def leafe(segment)
    {
      type: 'leafe',
      start_time: segment.start_time,
      end_time: segment.end_time,
      time: Time.parse(segment.timecode).seconds_since_midnight,
      timecode: segment.timecode,
      tape_nbr: segment.tape.number,
      transcripts:{
          de:segment.translation.sub(/^\:+\s*\:*/,"").strip(),
          "#{segment.interview.language.code[0..1]}": segment.transcript.sub(/^\:+\s*\:*/,"").strip()
      }
    }
  end

  def create_node(node_id)
    {
      id: node_id,
      type: 'node',
      desc: RegistryEntry.find(node_id).localized_hash,
      children: [],
      leafe_count: 0
    }
  rescue
    nil
  end

  def find_or_create_node(array, node_id)
    result = array.select{|node| node[:id] == node_id}.first
    unless result
      result = create_node(node_id)
      array << result if result
    end
    result
  end

  def deep_find_or_create_node(array, node_id)
    result, ancestors = deep_find_node(array, node_id) 
    unless result
      result = create_node(node_id)
      #array << result
    end
    result
  end

  def deep_find_node(array, node_id, ancestors=[])
    result = array.select{|node| node[:id] == node_id}.first 
    unless result
      array.each do |node|
        result, this_ancestors = deep_find_node(node[:children], node_id, ancestors + [node]) if node[:children]
        return [result, this_ancestors] if result
      end
    end
    [result, ancestors]
  end

  def leafes_with_parent_nodes
    parent_nodes = []
    @registry_references.each do |ref| 
      if ref.ref_object
        node = find_or_create_node(parent_nodes, ref.registry_entry_id)
        if node
          node[:children] << leafe(ref.ref_object)
          node[:leafe_count] += 1;
        end
      end
    end
    parent_nodes
  end

  def prepend_parents(nodes)
    parent_nodes = []
    #nodes_without_parents_count = 0
    parents_found = false

    until nodes.empty?
      node = nodes.shift
      parent = RegistryEntry.find(node[:id]).parents.first

      # a parent registry_entry exists!
      if parent 
        parents_found = true
        # is one of the current nodes parent of this (shifted) node?
        parent_node, ancestors = deep_find_node(parent_nodes, parent.id) 
        parent_node, ancestors = deep_find_node(nodes, parent.id) unless parent_node
        # the parent-node does not exist in the current nodes-tree:
        unless parent_node
          parent_node = create_node(parent.id) 
          parent_nodes << parent_node
        end
        parent_node[:children] << node
        parent_node[:leafe_count] += node[:leafe_count]
        ancestors.each{|a| a[:leafe_count] += node[:leafe_count]} if ancestors
      # there is no parent registry_entry:
      else
        p "*** node #{node[:id]} has no parents!"
        #nodes_without_parents_count += 1
        # is this node a member of the new parent_nodes-tree?
        parent_node = parent_nodes.select{|p| p[:id] == node[:id]}.first
        if parent_node
          parent_node[:children] += node[:children]
          parent_node[:leafe_count] += node[:leafe_count];
        else
          parent_nodes << node 
        end
      end
    end

    p "*** parent_nodes length = #{parent_nodes.length}"
    #if parent_nodes.length == nodes_without_parents_count
    if !parents_found
      parent_nodes
    else
      prepend_parents(parent_nodes)
    end
  end
end
