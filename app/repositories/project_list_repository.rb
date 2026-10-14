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
  def ordered(field:, direction:)
    expression = SORT_COLUMNS.fetch(field) || localized_name
    sql_direction = { asc: 'ASC', desc: 'DESC' }.fetch(direction)
    clauses = []
    clauses << "#{expression} IS NULL ASC" if %w[name publication_date].include?(field)
    clauses << "#{expression} #{sql_direction}"
    clauses << "projects.id #{sql_direction}" unless field == 'id'
    @projects.reorder(Arel.sql(clauses.join(', ')))
  end

  private

  # Sort by the displayed label, falling back to the name as consumers do.
  # Ignore leading punctuation and whitespace only for sorting; preserve the label.
  def localized_name
    name = "COALESCE(#{localized_attribute('display_name')}, #{localized_attribute('name')})"
    pattern = @projects.klass.connection.quote('^[\p{P}\p{Z}\s]+')
    "REGEXP_REPLACE(#{name}, #{pattern}, '')"
  end

  # Match the serializer: requested locale, project default, then the first
  # nonblank translation by ID. Each attribute uses this fallback independently.
  def localized_attribute(attribute)
    locale = @projects.klass.connection.quote(@locale.to_s)
    # The subquery selects one value per project without duplicating project rows.
    <<~SQL.squish
      (SELECT project_translations.#{attribute}
       FROM project_translations
       WHERE project_translations.project_id = projects.id
         AND project_translations.#{attribute} REGEXP '[^[:space:]]'
       ORDER BY CASE
         WHEN project_translations.locale = #{locale} THEN 0
         WHEN project_translations.locale = projects.default_locale THEN 1
         ELSE 2
       END, project_translations.id ASC
       LIMIT 1)
    SQL
  end
end
