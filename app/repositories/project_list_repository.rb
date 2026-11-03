# Sorts a project relation that the caller has already authorized and filtered.
# Apply this ordering before pagination so localized names sort across all results.
class ProjectListRepository
  # Only these fields can become SQL expressions. Name needs a translation lookup.
  SORT_COLUMNS = {
    'name' => nil,
    'shortname' => 'projects.shortname',
    'created_at' => 'projects.created_at',
    'publication_date' => 'projects.publication_date',
    'id' => 'projects.id',
  }.freeze

  def initialize(projects, locale:)
    @projects = projects
    @locale = locale
  end

  # Returns a relation without loading records. Direction is :asc or :desc.
  # Missing names and publication dates sort last in either direction.
  # When sort values match, sort by ID too so page boundaries stay consistent.
  #
  # @param field [String] Allowlisted sort field
  # @param direction [Symbol] :asc or :desc
  # @return [ActiveRecord::Relation] Ordered projects within the supplied scope
  def ordered(field:, direction:)
    column = SORT_COLUMNS.fetch(field)
    expression = column ? @projects.klass.arel_table[field] : localized_name
    ordering = { asc: Arel::Nodes::Ascending, desc: Arel::Nodes::Descending }.fetch(direction)
    clauses = []
    clauses << expression.eq(nil).asc if %w[name publication_date].include?(field)
    clauses << ordering.new(expression)
    clauses << ordering.new(@projects.klass.arel_table[:id]) unless field == 'id'
    @projects.reorder(*clauses)
  end

  private

  # Sort by the displayed label, falling back to the name as consumers do.
  # Ignore leading punctuation and whitespace only for sorting; preserve the label.
  #
  # @return [Arel::Nodes::NamedFunction] Normalized localized label
  def localized_name
    name = Arel::Nodes::NamedFunction.new('COALESCE', [localized_attribute('display_name'), localized_attribute('name')])
    pattern = Arel::Nodes.build_quoted('^[\p{P}\p{Z}\s]+')
    Arel::Nodes::NamedFunction.new('REGEXP_REPLACE', [name, pattern, Arel::Nodes.build_quoted('')])
  end

  # Match the serializer: requested locale, project default, then the first
  # nonblank translation by ID. Each attribute uses this fallback independently.
  #
  # @param attribute [String] Translation column to select
  # @return [Arel::Nodes::Grouping] Correlated scalar translation subquery
  def localized_attribute(attribute)
    projects = @projects.klass.arel_table
    translations = Arel::Table.new(:project_translations)
    priority = Arel::Nodes::Case.new
      .when(translations[:locale].eq(@locale.to_s)).then(0)
      .when(translations[:locale].eq(projects[:default_locale])).then(1)
      .else(2)
    # The subquery selects one value per project without duplicating project rows.
    query = translations.project(translations[attribute])
      .where(translations[:project_id].eq(projects[:id]))
      .where(Arel::Nodes::InfixOperation.new('REGEXP', translations[attribute], Arel::Nodes.build_quoted('[^[:space:]]')))
      .order(priority, translations[:id].asc)
      .take(1)
    Arel::Nodes::Grouping.new(query.ast)
  end
end
