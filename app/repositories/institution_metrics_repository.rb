class InstitutionMetricsRepository
  def initialize(institutions:, projects_scope:)
    @institutions = Array(institutions)
    @institution_ids = @institutions.map(&:id)
    @projects_scope = projects_scope
  end

  def projects_by_institution
    result = Hash.new { |hash, key| hash[key] = [] }

    visible_projects.each do |project|
      project.institutions.each do |institution|
        next unless @institution_ids.include?(institution.id)

        result[institution.id] << project
      end
    end

    result
  end

  def interview_counts
    rollup_project_counts_by_institution(project_interview_counts)
  end

  def project_interview_counts
    return {} if visible_project_ids.blank?

    Interview
      .where(project_id: visible_project_ids)
      .group(:project_id, :workflow_state)
      .count
  end

  def collection_counts
    rollup_project_counts_by_institution(project_collection_counts)
  end

  private

  def rollup_project_counts_by_institution(project_counts)
    return {} if @institution_ids.blank?

    result = {}

    project_ids_by_institution.each do |institution_id, project_ids|
      next if project_ids.blank?

      %w(public restricted unshared).each do |state|
        total = project_ids.sum { |project_id| project_counts.fetch([project_id, state], 0) }
        result[[institution_id, state]] = total
      end
    end

    result
  end

  def project_ids_by_institution
    @project_ids_by_institution ||= begin
      direct_map = Hash.new { |hash, key| hash[key] = [] }

      InstitutionProject
        .where(project_id: visible_project_ids)
        .pluck(:institution_id, :project_id)
        .each do |institution_id, project_id|
          direct_map[institution_id] << project_id
        end

      descendant_ids_map.each_with_object({}) do |(institution_id, related_ids), result|
        result[institution_id] = related_ids.flat_map { |id| direct_map[id] }.uniq
      end
    end
  end

  def descendant_ids_map
    @descendant_ids_map ||= begin
      children_map = Hash.new { |hash, key| hash[key] = [] }

      Institution
        .pluck(:id, :parent_id)
        .each do |id, parent_id|
          children_map[parent_id] << id if parent_id
        end

      @institution_ids.each_with_object({}) do |institution_id, result|
        result[institution_id] = descendant_ids_for(institution_id, children_map)
      end
    end
  end

  def descendant_ids_for(root_id, children_map)
    ids = [root_id]
    queue = [root_id]

    until queue.empty?
      current_id = queue.shift
      children = children_map[current_id] || []

      children.each do |child_id|
        next if ids.include?(child_id)

        ids << child_id
        queue << child_id
      end
    end

    ids
  end

  def project_collection_counts
    @project_collection_counts ||= begin
      return {} if visible_project_ids.blank?

      Collection
        .where(project_id: visible_project_ids)
        .group(:project_id, :workflow_state)
        .count
    end
  end

  def visible_projects
    @visible_projects ||= @projects_scope
      .includes(
        :translations,
        { institutions: :translations },
        logos: [file_attachment: :blob]
      )
      .to_a
  end

  def visible_project_ids
    @visible_project_ids ||= visible_projects.map(&:id)
  end
end
