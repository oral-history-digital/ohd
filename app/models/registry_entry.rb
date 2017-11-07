require 'acts-as-dag'
require 'tsort'
require 'i18n/core_ext/string/interpolate'

class RegistryEntry < ActiveRecord::Base
  ROOT_NODE_ID = 1

  NAME_PATTERNS = {
      :person => ['%{last_name}, %{first_name}', :last_name, :first_name, :birth_name],
      :spelling => ['%{spelling}', :spelling]
  }

  INVALID_ENTRY_TEXT = 'Missing Translation'

  #ONIGURUMA_OPTIONS = {:options => Oniguruma::OPTION_IGNORECASE, :encoding => Oniguruma::ENCODING_UTF8}
  ONIGURUMA_OPTIONS = {:options => 'i', :encoding => 'utf8'}

  has_many :registry_names,
           -> { includes(:translations) },
           #-> { includes(:translations, :registry_name_type) },
           :dependent => :destroy

  has_many :registry_references,
           :dependent => :destroy

  # The following represents registry reference types
  # "allowed" for all entries that are descendants
  # of this entry.
  has_many :registry_reference_types,
           :dependent => :destroy

  # Registry entries are modeled as a directed acyclic graph.
  #has_dag_links :link_class_name => 'RegistryHierarchy'

  #has_many :main_registers,
           #-> { where('EXISTS (SELECT * FROM registry_hierarchies parents WHERE parents.descendant_id = registry_hierarchies.ancestor_id AND parents.ancestor_id = 1 AND parents.direct = 1)') },
           #:through => :links_as_descendant,
           #:source => :ancestor

  # Every registry entry (except for the root entry) must have at least one parent.
  # Otherwise we get orphaned registry entries.
  attr_writer :do_not_validate_parents
  validate :must_have_parents
  def must_have_parents
    return if id == ROOT_NODE_ID || @do_not_validate_parents
    if parents.empty?
      errors[:base] << 'Ein Registereintrag braucht mindestens eine Klassifizierung.'
    end
  end

  WORKFLOW_STATES = [:preliminary, :public, :hidden, :rejected]
  validates_inclusion_of :workflow_state, :in => WORKFLOW_STATES.map(&:to_s)

  # A registry entry may not be deleted if it still has children or
  # references pointing to it.
  def before_destroy
    children.count == 0 and registry_references.count == 0
  end

  scope :with_state, -> (workflow_state) {
    where(workflow_state: workflow_state)
  }

  # Order registry entries lexicographically by name even when they
  # consist of several distinct registry names (ie. several name
  # types or name positions).
  scope :ordered_by_name,
        -> { joins( %Q(
                   INNER JOIN registry_names ON registry_entries.id = registry_names.registry_entry_id
                   INNER JOIN registry_name_types ON registry_names.registry_name_type_id = registry_name_types.id
                   INNER JOIN registry_name_translations stdname ON registry_names.id = stdname.registry_name_id AND stdname.locale = '#{I18n.default_locale}'
             )).
             includes(registry_names: [:translations, :registry_name_type]).
             group('registry_entries.id').
             order('registry_entries.list_priority DESC, GROUP_CONCAT(DISTINCT stdname.descriptor COLLATE utf8_general_ci ORDER BY registry_name_types.order_priority, registry_names.name_position SEPARATOR " ")')
           }

  # Filter registry entries that have reference types defined on them.
  scope :with_reference_types,
        # The following is an INNER JOIN which will
        # automatically filter registry entries that
        # actually have registry reference types
        # defined.
        -> { joins(:registry_reference_types).
        # NB: Grouping doesn't work correctly with
        # the .size/.count method! Counting the number of
        # available reference types has to be done after
        # retrieving them.
        group('registry_entries.id') }

  scope :with_reference_to, -> (referenced_object) {
        joins(:registry_references).
        where(
            'registry_references.ref_object_id = ? AND registry_references.ref_object_type = ?',
            referenced_object.id, referenced_object.class.to_s
        )
  }

  scope :with_location, -> { where("latitude <> '' AND longitude <> ''")}

  class << self
    # This is not a translated class but it can accept localized descriptors.
    def with_locale(locale)
      previous_locale, self.locale = self.locale, locale
      begin
        result = yield
      ensure
        self.locale = previous_locale
      end
      result
    end

    def root_node
      @root_node ||= find(RegistryEntry::ROOT_NODE_ID)
    end

    STOP_IF_PATHS_EXCEED = 20

    def find_by_pattern(pattern, root_entry = nil)
      return [] if pattern.blank?

      # Find the starting point from which to filter the graph.
      # This is either the root of the registry or the given
      # root node.
      root_entry = if root_entry.nil?
                     # No root node has been given. Find the top
                     # level root node of the registry. (By definition
                     # there should be exactly one!)
                     select('DISTINCT registry_entries.id').
                     joins('LEFT JOIN registry_hierarchies ON registry_entries.id = registry_hierarchies.descendant_id').
                     where('registry_hierarchies.id IS NULL').
                     includes(registry_names: :translations).
                     first
                   else
                     # Root node information has been given. Resolve
                     # it to a registry entry.
                     if root_entry.is_a?(String)
                       # A string: resolve by looking at entry names.
                       find_by_name(root_entry)
                     elsif root_entry.is_a?(Integer)
                       # An integer: check whether it points to an existing entry.
                       find(root_entry)
                     else
                       # Anything else: should be a registry entry.
                       root_entry
                     end
                   end
      root_entry_id = root_entry.is_a?(RegistryEntry) ? root_entry.id : nil
      return [] if root_entry_id.blank?

      # Select all descendants of the root node and filter them by name. Then
      # get all ancestors of the filtered nodes.
      # NB: We use raw SQL here to optimize query performance.
      matching_nodes_sql =
          "SELECT DISTINCT IFNULL(rh.ancestor_id, re.id) AS ancestor_id, re.id AS entry_id
           FROM registry_entries re
             -- find descendants of the given root node
             INNER JOIN registry_hierarchies rh_filter ON re.id = rh_filter.descendant_id AND rh_filter.ancestor_id = #{root_entry_id}
             -- filter these descendants by name/alias
             INNER JOIN registry_names rn ON re.id = rn.registry_entry_id
             INNER JOIN registry_name_translations rnt ON rn.id = rnt.registry_name_id
             -- find all ancestors of the filtered entries
             LEFT JOIN registry_hierarchies rh ON re.id = rh.descendant_id"

      # Find all nodes matching the pattern as well as their ancestors...

      # First try a fast (indexed) exact match on specific name types. This
      # will return fast even if we got a non-selective search pattern.
      fast_pattern = "#{pattern.gsub('*', '%')}%"
      lc_pattern = ActiveRecord::Base.quote_value(fast_pattern.downcase)
      uc_pattern = ActiveRecord::Base.quote_value(fast_pattern.capitalize)
      matching_nodes = ActiveRecord::Base.connection.select_all(
          "#{matching_nodes_sql}
           INNER JOIN registry_name_types rt ON rn.registry_name_type_id = rt.id
           WHERE (rnt.descriptor LIKE #{lc_pattern} OR rnt.descriptor LIKE #{uc_pattern}) AND rt.code IN ('spelling', 'last_name')"
      )
      if matching_nodes.map { |n| n['entry_id'] }.uniq.count < STOP_IF_PATHS_EXCEED
        # When there are not enough exact matches then do a fuzzy match
        # (=case insensitive matches and matches within a word are allowed).
        # This will return reasonably fast with selective search patterns.
        matching_nodes = ActiveRecord::Base.connection.select_all(
            "#{matching_nodes_sql} WHERE LOWER(rnt.descriptor) LIKE LOWER(#{ActiveRecord::Base.quote_value("%#{pattern.gsub('*', '%')}%")})"
        )
      end

      # Extract the relevant node types from the result.
      path_entries = matching_nodes.map { |n| n['ancestor_id'].to_i }.uniq
      leaf_entries = matching_nodes.map { |n| n['entry_id'].to_i }.uniq
      not_yet_visited = (path_entries + leaf_entries).uniq - [root_entry_id]

      # Do a breadth first search starting with the root node
      # and return the matching registry entries closest
      # to the root.
      matching_paths = []
      frontier = [[root_entry_id]]
      until frontier.empty? or matching_paths.size >= STOP_IF_PATHS_EXCEED
        frontier_ids = frontier.map { |path| path.last }.uniq
        new_frontier = []
        now_visited = []
        RegistryHierarchy.all(:conditions => {:ancestor_id => frontier_ids, :descendant_id => not_yet_visited, :direct => true}).each do |rh|
          frontier.select { |path| path.last == rh.ancestor_id }.each do |path|
            now_visited << rh.descendant_id
            new_path = (path.dup << rh.descendant_id)
            matching_paths << new_path if leaf_entries.include? rh.descendant_id
            new_frontier << new_path if path_entries.include? rh.descendant_id
          end
        end
        # Never visit the same node twice. We're only interested
        # in the hits closest to the root node.
        not_yet_visited -= now_visited
        frontier = new_frontier
      end

      # Preload required entries to build final result set with descriptors.
      preloaded_entries = {}
      find(matching_paths.flatten.uniq, :include => [:parents, {:registry_names => [:translations, :registry_name_type]}]).each do |preloaded_entry|
        names_by_locale = {}
        (I18n.available_locales).each do |locale|
          localized_name = preloaded_entry.to_s(locale)
          names_by_locale[locale] = localized_name unless localized_name.blank?
        end
        aliases = preloaded_entry.registry_names.map { |rn| rn.descriptor(:alias) }.reject(&:blank?)
        names_by_locale[:aliases] = aliases.join(';').split(';')
        preloaded_entries[preloaded_entry.id] = [preloaded_entry, names_by_locale]
      end

      # A regular expression to find the pattern in descriptions.
      pattern_regexp = Regexp.new(pattern.gsub('*', '.*'), RegistryEntry::ONIGURUMA_OPTIONS)

      # An inner function that creates a hash describing several aspects of the path.
      # The path must be represented by a unique descriptor that fully qualifies and
      # the matching string (standard name, translation or alias), the standard name
      # of the entry if it is not the matching string itself and the classification
      # of the entry. These elements together will make the display name completely unique
      # and identifiable across the whole register.
      description_for = lambda do |path|
        path_description = {
            :path_entries => [],
            :matching_name => nil,
            :display_name => nil
        }

        # Resolve the path to registry entries and their names.
        path_names = []
        path.each_with_index do |entry_id, index|
          preloaded_entry, preloaded_names = preloaded_entries[entry_id]
          path_description[:path_entries] << preloaded_entry

          # Do not include the top-level path entry in the path name as
          # this is the filtered (and therefore well-known) root entry.
          # Also don't include the last entry which will be represented
          # by a matching_name and differentiator.
          next if index == 0 or index == path.size-1
          path_names << preloaded_names[I18n.locale]
        end

        # Join the path parts into a readable string.
        path_name = path_names.reject(&:blank?).join('/')
        path_name = " - #{path_name}" unless path_name.blank?

        # Now find a display name that best represents the entry...
        entry = preloaded_entries[path.last].first
        entry_names = preloaded_entries[path.last].second

        # 1) First check whether the standard name in the current
        # locale matches the pattern. If so choose it.
        standard_name = entry_names[I18n.locale]
        if standard_name =~ pattern_regexp
          path_description[:display_name] = "#{standard_name}#{path_name} - ID: #{entry.id}"
          path_description[:matching_name] = standard_name
          return path_description
        end

        # 2) Now check whether a matching entry in one of the
        # standard entries of the other languages exists.
        matching_locale = I18n.available_locales.detect do |locale|
          entry_names[locale] =~ pattern_regexp
        end
        unless matching_locale.blank?
          path_description[:matching_name] = entry_names[matching_locale]
          path_description[:display_name] = "#{entry_names[matching_locale]} - #{standard_name}#{path_name} - ID: #{entry.id}"
          return path_description
        end

        # 3) Finally go through the alias names and take the first
        # one that matches the pattern.
        return nil if entry_names[:aliases].blank?
        alias_name = entry_names[:aliases].
            detect { |desc| desc =~ pattern_regexp }
        return nil if alias_name.blank?
        path_description[:matching_name] = alias_name
        path_description[:display_name] = "#{alias_name} - #{standard_name}#{path_name} - ID: #{entry.id}"
        path_description
      end

      matching_paths.map! do |path|
        description_for.call(path)
      end
      matching_paths.compact!

      # Order paths by best match, i.e. put results that match in the
      # beginning of the entry above results that match in beginning
      # of a word which again are above matches the middle of a word.
      matches_full_word_at_start = Regexp.new("^#{pattern.gsub('*', '.*')}\\b", RegistryEntry::ONIGURUMA_OPTIONS)
      matches_full_word = Regexp.new("\\b#{pattern.gsub('*', '.*')}\\b", RegistryEntry::ONIGURUMA_OPTIONS)
      matches_start_of_entry = Regexp.new("^#{pattern.gsub('*', '.*')}", RegistryEntry::ONIGURUMA_OPTIONS)
      matches_start_of_word = Regexp.new("\\b#{pattern.gsub('*', '.*')}", RegistryEntry::ONIGURUMA_OPTIONS)
      evaluate_relevance = lambda do |entry_name|
        if entry_name =~ matches_full_word_at_start
          0
        elsif entry_name =~ matches_full_word
          1
        elsif entry_name =~ matches_start_of_entry
          2
        elsif entry_name =~ matches_start_of_word
          3
        else
          4
        end
      end

      matching_paths.sort do |a, b|
        relevance_of_a, relevance_of_b = [a, b].map { |e| evaluate_relevance.call(e[:matching_name]) }
        if relevance_of_a != relevance_of_b
          relevance_of_a <=> relevance_of_b
        else
          # Within matches of the same quality: entries closer
          # to the root appear first.
          distance_a, distance_b = [a, b].map { |e| e[:path_entries].size }
          if distance_a != distance_b
            distance_a <=> distance_b
          else
            # Within entries that match with the
            # same relevance and root distance:
            # order alphabetically.
            a[:display_name] <=> b[:display_name]
          end
        end
      end
    end

    def create_with_name!(attributes = {})
      registry_entry = build_with_name(attributes)
      registry_entry.save!
      registry_entry
    end

    # Build a new registry entry and the corresponding registry name.
    #
    # Name types, locales, positions, etc. can either be given
    # explicitly (in a special hash/array format documented below)
    # or implicitly (in a reduced hash/array format or as simple
    # strings).
    #
    # The :descriptor attribute contains the name information and is
    # expected in the attributes parameter.
    #
    # = Implicit Name Types =
    #
    # When no explicit name types have been given and the names are
    # given as a single string (rather an array of strings), the
    # following patterns will be tested to identify name types:
    #
    # 1) Person name pattern:
    #
    #      person_name := last_names,[first_names][birth_names][differentiator]
    #      first_names := ', ' + descriptor[ descriptor[ ...]]
    #      last_names := descriptor[ descriptor[ ...]]
    #      birth_names := '(' + localized_birth_name_marker descriptor[ descriptor[ ...]] + ')'
    #      differentiator := '[' + descriptor + ']'
    #      descriptor := all characters except whitespace and any of ,()[]
    #
    #    NB: The name pattern matches whenever a single comma is found in the string.
    #
    # 2) Spelling pattern:
    #
    #      spelling := descriptor[ differentiator]
    #      differentiator := '[' + descriptor + ']'
    #      descriptor := all characters except whitespace and any of []
    #
    #    NB: The more specific person name pattern is tested first. The spelling pattern
    #    is treated as a fallback.
    #
    # When none of the two pattern matches then the whole string
    # will be used as a spelling-type descriptor.
    #
    # = Implicit Locale =
    #
    # When no explicit locale has been given then the name will be
    # created with the default locale.
    #
    # = Positions =
    #
    # Whenever an array of content is given, it represents name positions.
    #
    # = Explicit Hash/Array Format =
    #
    # When the method argument is given as a hash then several registry
    # names will be created. See the following example that shows all
    # possibilities for the names parameter as a hash:
    #
    #   {
    #     :de => 'German spelling',
    #     :name_type_1 => 'default locale descriptor, position 0',
    #     :name_type_2 => ['default locale descriptor, position 0', 'position 1', '...']
    #     :name_type_3 => {:de => 'German descriptor', :en => '...', :alias => 'alias 1;alias 2;...'}
    #     :name_type_4 => [
    #         {:de => 'position 0 in German', :en => '...', :alias => 'position 0 alias 1;...'},
    #         {:de => 'position 1 in German', ...}
    #     ]
    #   }
    #
    # = Classification =
    #
    # The option hash can contain classifications or sub-entries
    # for the new registry entry.
    #
    # Classifications can be given with the :parents => [...] option
    # and sub-entries with the :children => [...] option.
    #
    def build_with_name(attributes)
      attributes = attributes.dup
      names = attributes.delete(:descriptor)

      # Check whether the locale is implicit.
      if names.is_a? String or names.is_a? Array
        names = {I18n.default_locale => names}
      end
      raise unless names.is_a? Hash
      names = names.to_hash.symbolize_keys # In case we got called with some param[...].

      # Check whether should be tested for implicit
      # name types or whether explicit name types have
      # been given.
      names = names.inject({}) do |result, name|
        name_type_or_locale, name_info = name
        if (I18n.available_locales + [:alias]).include? name_type_or_locale
          if name_info.is_a? String
            # Positions and name types are implicit...
            parsed_name = parse_name(name_info, :locale => name_type_or_locale)
          elsif name_info.is_a? Array
            # Positions have been given explicitly, only the name type is implicit...
            parsed_name = {:spelling => name_info}
          else
            raise 'invalid format'
          end

          # Merge implicit and explicit name info into a single normalized hash.
          parsed_name.each do |name_type, descriptors|
            result[name_type] ||= []
            raise 'invalid format' unless result[name_type].is_a? Array
            descriptors.each_with_index do |descriptor, position|
              result[name_type][position] ||= {}
              raise 'invalid format' unless result[name_type][position][name_type_or_locale].nil?
              result[name_type][position][name_type_or_locale] = descriptor
            end
          end
        else
          result[name_type_or_locale] = name_info
        end
        result
      end

      # Create a new registry entry.
      attributes[:workflow_state] ||= 'preliminary'
      registry_entry = RegistryEntry.new attributes.except(:parents, :children)

      # Define the names and translations to be created.
      names.each do |name_type, name_info|
        # Normalize the name information to an array of positions.
        name_info = {I18n.default_locale => name_info} if name_info.is_a? String
        name_info = [name_info] if name_info.is_a? Hash
        raise 'invalid format' unless name_info.is_a? Array

        name_info.each_with_index do |position_info, name_position|
          # Normalize the position information to a hash of locales.
          position_info = {I18n.default_locale => position_info} if position_info.is_a? String
          raise unless position_info.is_a? Hash

          # Add a registry name with the given type and position.
          registry_name = registry_entry.registry_names.build \
                :registry_name_type_id => RegistryNameType.find_by_code(name_type.to_s).id,
                :name_position => name_position

          position_info.each do |locale, descriptor|
            raise if not (I18n.available_locales + [:alias]).include?(locale.to_sym) or descriptor.empty?

            # Create translation entries for all given locales.
            registry_name.translations.build \
                :locale => locale.to_s,
                :descriptor => descriptor
          end
        end
      end

      # Link the new entry with its parents and children.
      [:parents, :children].each do |attribute|
        unless attributes[attribute].blank?
          attributes[attribute].each { |parent|
            parent = find(parent) unless parent.is_a? RegistryEntry
            registry_entry.send(attribute) << parent
          }
        end
      end

      registry_entry
    end

    # Find entries by their language-specific standard name.
    #
    # Names can be given in their implicit form using name patterns
    # (see method comments of RegistryEntry.build_with_name above).
    #
    # Returns an array of entries that match the given name.
    def find_all_by_name(name, locale = I18n.default_locale, options = {})
      parsed_name = parse_name(name)

      include_options = options[:include] || {}
      joins = []
      conditions = []
      parsed_name.each do |name_type, descriptors|
        descriptors.each_with_index do |descriptor, position|
          number = joins.size
          joins << "INNER JOIN registry_names rn#{number} ON registry_entries.id = rn#{number}.registry_entry_id
                    INNER JOIN registry_name_types rt#{number} ON rn#{number}.registry_name_type_id = rt#{number}.id
                    INNER JOIN registry_name_translations  rnt#{number} ON rn#{number}.id = rnt#{number}.registry_name_id"
          conditions << [
              "rt#{number}.code = ?
               AND rn#{number}.name_position = ?
               AND rnt#{number}.descriptor = ?
               AND rnt#{number}.locale = ?",
              name_type.to_s, position, descriptor, locale.to_s
          ]
        end
      end

      joins = joins.join(' ')
      conditions = conditions.map do |condition|
        send(:sanitize_sql_array, condition)
      end.join(' AND ')

      select('DISTINCT registry_entries.*').
      joins(joins).
      includes(registry_names: [:registry_name_type, :translations]).#, include_options).
      where(conditions)
    end

    def find_by_name(name, locale = I18n.default_locale, options = {})
      matching_entries = find_all_by_name(name, locale, options)
      raise 'Did not find a unique registry entry.' if matching_entries.size > 1
      matching_entries.first # Returns nil when no entry was found.
    end

    PERSON_NAME_PATTERN = I18n.available_locales.inject({}) do |result, locale|
      born = Regexp.escape(I18n.t('registry_entry.born', :locale => locale))
      result[locale] = Regexp.new(
          '^\s*(?<last_names>[^,()\[\]]+?)\s*,\s*' +
              '(?<first_names>[^,()\[\]]+?)?\s*' +
              '(?:\(\s*%{born}\s+(?<birth_names>[^,()\[\]]+?)\s*\))?\s*' % {:born => born} +
              '(?:\[\s*(?<differentiator>[^,()\[\]]*?)\s*\])?\s*$',
          RegistryEntry::ONIGURUMA_OPTIONS
      )
      result
    end
    SPELLING_PATTERN = Regexp.new(
        '^\s*(?<spelling>.+?)\s*(?:\[\s*(?<differentiator>[^\[\]]*?)\s*\])?\s*$',
        RegistryEntry::ONIGURUMA_OPTIONS
    )

    def parse_name(name, options = {})
      options = {:locale => I18n.default_locale}.merge(options)

      # Test for the person name pattern.
      parse_alias = (options[:locale] == :alias)
      locale = (parse_alias ? I18n.default_locale : options[:locale])
      match = PERSON_NAME_PATTERN[locale].match(name)
      if match
        match_groups = [:last_names, :first_names, :birth_names, :differentiator]
      else
        # Test for the spelling pattern.
        match = SPELLING_PATTERN.match(name)
        match_groups = [:spelling, :differentiator]
      end
      raise 'invalid format' unless match

      match_groups.inject({}) do |result, match_group|
        unless match[match_group].blank?
          name_type = match_group.to_s.singularize.to_sym
          result[name_type] = if match_group == name_type
                                # singular: only a single descriptor position allowed
                                [match[match_group]]
                              else
                                # plural: several positions allowed for this name type
                                match[match_group].split(/\s+/)
                              end
          # Consider three dashes (---) as a placeholder for a blank descriptor.
          result[name_type].reject!{|d| d == '---'}
          # Reformat aliases.
          result[name_type].map!{|desc| desc.gsub('/', ';')} if parse_alias
        end
        result
      end
    end

    # Performance optimized function that counts children for a given list of
    # registry entries.
    def count_children(registry_entry_ids)
      registry_entry_ids = [registry_entry_ids] unless registry_entry_ids.is_a? Array
      return {} if registry_entry_ids.empty?
      registry_entry_ids = registry_entry_ids.uniq.map(&:to_i)

      # Retrieve the registry_entry -> register mapping in a single SQL.
      results = ActiveRecord::Base.connection.select_all(
          "SELECT ancestor_id AS id, COUNT(*) AS child_count
           FROM registry_hierarchies
           WHERE ancestor_id IN (#{ActiveRecord::Base.quote_bound_value(registry_entry_ids)})
             AND direct = 1
           GROUP BY ancestor_id"
      )

      # Create a hash from the results.
      results.inject({}) do |result, row|
        result[row['id'].to_i] = row['child_count']
        result
      end
    end

    # Find all registry entries which are neither referenced themselves nor
    # any of their descendants are being referenced.
    def find_all_unused()
      joins('LEFT JOIN registry_references AS rr ON rr.registry_entry_id = registry_entries.id').
      where('rr.id IS NULL
              AND NOT EXISTS (
                SELECT *
                FROM registry_references rr
                INNER JOIN registry_hierarchies rh
                  ON rr.registry_entry_id = rh.descendant_id
                WHERE registry_entries.id = rh.ancestor_id
              )'
           )
    end

    # Find all registry entries that belong to a configured
    # category (see project.yml in the public archive project
    # for an example of configured categories.) When a referenced
    # object is given then only registry entries referenced by
    # that object will be returned.
    def find_all_by_category(category_id, referenced_object = nil)
      begin
        category_object = Project.category_object(category_id)
      rescue
        return []
      end

      case category_object

        when RegistryEntry
          if referenced_object.blank?
            category_object.children
          else
            category_object.children.with_reference_to(referenced_object)
          end

        when RegistryReferenceType
          if referenced_object.blank?
            # Search all distinct registry entries referenced with the given type.
            joins(:registry_references).
            where(registry_references: {registry_reference_type_id: category_object.id}).
            group('registry_entries.id')
          else
            # Search all registry entries referenced from the referenced object with the given type.
            # NB: These must be unique entries (enforced by a unique index on references).
            referenced_object.registry_references.with_type_id(category_object.id).map(&:registry_entry)
          end

        else
          raise 'Unknown category object type.'

      end
    end

  end

  def allowed_reference_types
    ancestors.with_reference_types.map(&:registry_reference_types).flatten
  end

  def available_reference_types(options = {})
    ref_types = allowed_reference_types
    if options[:include_descendants]
      ref_types += registry_reference_types
      ref_types += descendants.with_reference_types.map(&:registry_reference_types).flatten
    end
    ref_types
  end

  def name_types(pattern)
    NAME_PATTERNS[pattern][1..-1]
  end

  def name_pattern
    if registry_names.any? { |name| name_types(:person).include? name.registry_name_type.to_sym }
      :person
    else
      :spelling
    end
  end

  def allowed_name_types
    if @allowed_name_types.nil?
      # Identify name types supported for this registry entry.
      allowed_name_types = name_types(name_pattern)
      allowed_name_types |= [:differentiator]

      # Add all name types already in use (even when person and spelling
      # name types are inconsistently mixed up).
      allowed_name_types |= registry_names.map{ |n| n.registry_name_type.to_sym }

      # Order supported types and return them as objects.
      @allowed_name_types = RegistryNameType.where(code: allowed_name_types.map(&:to_s)).
                                            order('order_priority')

    end
    @allowed_name_types
  end

  def registry_names_by_type
    # Prepare a hash for registry names indexed by supported types.
    registry_names_by_type = allowed_name_types.inject({}) do |result, registry_name_type|
      result[registry_name_type.to_sym] ||= []
      result
    end

    # Go through registry names and order them by supported type.
    registry_names.inject(registry_names_by_type) do |result, registry_name|
      type_code = registry_name.registry_name_type.to_sym
      result[type_code][registry_name.name_position] = registry_name
      result
    end
  end

  def available_translations
    registry_names.map { |n| n.translations.map{|t| t.locale[0..1]} }.flatten.uniq
    #registry_names.map { |n| n.translations.map(&:locale) }.flatten.uniq
  end

  def descriptor=(descriptor)
    case descriptor
      when Hash
        # Could be a HashWithIndifferentAccess.
        descriptors = descriptor.to_hash.symbolize_keys
        descriptors.each do |locale, descriptor|
          RegistryEntry.with_locale(locale) do
            self.descriptor = descriptor
          end
        end
        return
      when String # no-op
      when NilClass # no-op
      else raise 'invalid descriptor'
    end

    locale = RegistryEntry.locale || I18n.default_locale
    raise if not (I18n.available_locales + [:alias]).include?(locale)

    descriptor.strip! unless descriptor.nil?
    parsed_name = if descriptor.blank?
                    {}
                  else
                    RegistryEntry.parse_name(descriptor, :locale => locale)
                  end

    # First update existing registry names.
    registry_names.each do |registry_name|

      if parsed_name[registry_name.registry_name_type.to_sym].blank? or
          parsed_name[registry_name.registry_name_type.to_sym][registry_name.name_position].blank?
        # Delete obsolete registry name translation...

        # Delete the translation for the given locale.
        registry_name_translation = registry_name.translations.detect { |t| t.locale == locale }
        unless registry_name_translation.nil?
          registry_name.translations.destroy(registry_name_translation)
          registry_name.reload
        end

        # If this was its last translation: delete the whole registry name.
        if registry_name.translations.empty?
          registry_names.destroy(registry_name)
        end

      else
        # Update registry name.
        RegistryName.with_locale(locale) do
          registry_name.descriptor =
              parsed_name[registry_name.registry_name_type.to_sym][registry_name.name_position]
          registry_name.save!
        end
      end
    end
    registry_names.reload

    # Then add new registry names.
    parsed_name.each do |name_type, descriptors|
      registry_names_with_type = registry_names.with_type(name_type)
      if descriptors.size > registry_names_with_type.size
        # Add new positions.
        next_position = registry_names_with_type.size
        descriptors[registry_names_with_type.size..-1].each do |descriptor|
          # Add a registry name with the given type and position.
          registry_name = registry_names.create \
              :registry_name_type_id => RegistryNameType.find_by_code(name_type.to_s).id,
              :name_position => next_position

          # Create a translation entry for the given locale.
          registry_name.translations.create \
              :locale => locale.to_s,
              :descriptor => descriptor

          registry_names << registry_name
          next_position += 1
        end
      end
    end
  end

  def descriptor(locale = I18n.default_locale)
    if locale == :all
      available_translations.inject({}) do |result, locale|
        result[locale] = to_s(locale, true)
        result
      end
    else
      to_s(locale)
    end
  end

  def localized_hash
    registry_names.first.translations.inject({}) do |mem, name|
      mem[name.locale[0..1]] = name.descriptor
      mem
    end
  end

  def change_name_pattern!(requested_pattern)
    requested_pattern = requested_pattern.to_sym
    available_patterns = NAME_PATTERNS.keys

    # Check whether the given pattern is valid.
    unless available_patterns.include? requested_pattern
      raise "Cannot switch to name pattern '#{requested_pattern}': unknown pattern."
    end

    # Check whether we actually have to change something.
    current_pattern = name_pattern
    return if current_pattern == requested_pattern

    # The allowed name types will have to be re-evaluated
    # after changing the name pattern.
    @allowed_name_types = nil

    transformed_descriptors = descriptor(:all)

    # Transform the descriptors so that they fit the requested name pattern.
    transformed_descriptors.keys.each do |locale|
      case current_pattern
        # Person -> Spelling: Make sure that commas are being deleted.
        when :person
          transformed_descriptors[locale].gsub!(/\s*,\s*/, ' ')

        # Spelling -> Person: Make sure that we have exactly one comma per entry.
        when :spelling
          name_parts = transformed_descriptors[locale].split(/\s*,\s*/)
          if name_parts.size > 2
            name_parts = [name_parts[0], name_parts[1..-1].join(' ')]
          elsif name_parts.size == 1
            name_parts << ''
          end
          transformed_descriptors[locale] = name_parts.join(', ')
      end
    end

    # Update descriptors.
    self.descriptor = transformed_descriptors
    save!
  end

  def to_s_with_fallback(locale = I18n.default_locale)
    to_s(locale, true)
  end

  def to_s(locale = I18n.default_locale, with_fallback = false)
    # Order names by type and position.
    names_with_position = {}
    registry_names.each do |name|
      name_type = name.registry_name_type.to_sym
      translated_descriptor = if with_fallback
                                # Missing translations should be replaced by fallbacks.
                                name.descriptor(locale)
                              else
                                # Missing translations should be visible.
                                translation = name.translations.detect { |t| t.locale == locale }
                                (translation.blank? ? nil : translation.descriptor)
                              end
      unless translated_descriptor.nil?
        translated_descriptor = translated_descriptor.dup
        translated_descriptor.gsub!(';', '/') if locale.to_sym == :alias
        names_with_position[name_type] ||= []
        names_with_position[name_type][name.name_position] = translated_descriptor
      end
    end

    # Join positions into a single string per name type.
    names = {}
    available_name_types = []
    names_with_position.each do |name_type, positions|
      names[name_type] = positions.compact.join(' ')
      available_name_types << name_type
    end

    # Find a matching name pattern.
    pattern_spec = NAME_PATTERNS.detect do |dummy, pattern_parts|
      required_name_types = pattern_parts[1..-1]
      (required_name_types & available_name_types).size > 0
    end
    return "[#{INVALID_ENTRY_TEXT}: #{id}]" if pattern_spec.blank?
    pattern_name, pattern_parts = pattern_spec
    pattern = pattern_parts.first
    required_name_types = pattern_parts[1..-1]

    # Add the birth name to the pattern if available.
    # NB: We always want to make the birth name available in the
    # alias representation to provide an editable placeholder (e.g.
    # in the media view).
    if available_name_types.include? :birth_name or (pattern_name == :person and locale == :alias)
      pattern += " (#{I18n.t('registry_entry.born', :locale => locale)} %{birth_name})"
    end

    # Add the differentiator to the pattern if available.
    if available_name_types.include? :differentiator
      pattern += ' [%{differentiator}]'
    end

    # Add placeholders for required name types.
    required_name_types.each do |required_name_type|
      names[required_name_type] = '---' if names[required_name_type].blank?
    end

    # Apply the pattern.
    pattern % names
  end

  # We implement a delta update to efficiently maintain huge collections.
  # In principle this could better be done through a registry hierarchies
  # controller. The problem is that the dag module does some extra magic on
  # updating link associations like parents or children. We therefore have
  # to update the associations of RegistryEntry rather than adding/deleting
  # RegistryHierarchy instances directly.
  def parents_delta=(delta_records)
    deltahandling(:parents, delta_records)
  end
  def children_delta=(delta_records)
    deltahandling(:children, delta_records)
  end

  def paginated_children(filter = {}, page = 1, per_page = 25)
    filter = filter.clone()
    filter.delete('registry_entry.id')
    if filter.empty?
      # Optimization for unfiltered children (for fast drill down in most cases).
      @paginated_children ||= {}
      @paginated_children["#{page}-#{per_page}"] ||=
          children.ordered_by_name.paginate(
              :page => page,
              :per_page => per_page,
              :total_entries => children.size
          )
      @paginated_children["#{page}-#{per_page}"]
    else
      join_registry_references = false
      filter = Hash[
          filter.map do |k, v|
            entity, field = k.split('.')
            table_name = entity.pluralize
            join_registry_references = true if ['interviews', 'registry_references'].include? table_name
            ["#{table_name}.#{field}", v]
          end
      ]

      scope = children

      unless filter['interviews.archive_id'].blank?
        interview = Interview.find_by_archive_id(filter.delete('interviews.archive_id'))
        scope = scope.scoped(
            :joins => "LEFT JOIN segments s ON registry_references.ref_object_type = 'Segment'
                         AND registry_references.ref_object_id = s.id
                         AND s.interview_id = #{interview.id}
                       LEFT JOIN people p ON registry_references.ref_object_type = 'Person'
                         AND registry_references.ref_object_id = p.id
                         AND p.interview_id = #{interview.id}",
            :conditions => 's.id IS NOT NULL OR p.id IS NOT NULL'
        )
      end

      # NB: We rely on the undocumented feature of scopes that
      # joins will be added in inverse order of their appearance
      # in the code, i.e. the join on registry references must
      # be before we join people or segments (see above).
      if join_registry_references
        scope = scope.scoped :joins => :registry_references
      end

      unless filter['registry_entries.translation_state'].blank?
        # The 'translation_state' filter contains something like 'ru_available' or 'en_missing'
        locale, state = filter.delete('registry_entries.translation_state').split('_')
        raise 'invalid translation state locale' unless CeDiS.config.human_readable_locales.keys.include? locale.to_sym
        raise 'invalid translation state' unless ['available', 'missing'].include? state
        scope = scope.scoped(
            if state == 'available'
              { :conditions => ['registry_name_translations.locale = ?', locale] }
            else
              {
                  :joins => "LEFT JOIN registry_name_translations missing_translation ON registry_names.id = missing_translation.registry_name_id AND missing_translation.locale = #{ActiveRecord::Base.quote_value(locale)}",
                  :conditions => "missing_translation.id IS NULL"
              }
            end
        )
      end

      scope = scope.ordered_by_name.scoped(:conditions => filter)

      scope.paginate(
          :page => page,
          :per_page => per_page
      )
    end
  end

  def classification
    parents.map do |parent|
      main_registers = []
      frontier = parent.parents.dup
      until frontier.empty?
        current = frontier.pop
        if current == RegistryEntry.root_node or (current.parents.size == 1 and current.parents.first == RegistryEntry.root_node)
          main_registers |= [current]
        else
          frontier |= current.parents
        end
      end

      {
          :registry_entry => parent,
          :registers => main_registers,
      }
    end
  end

  def to_hash(options = {})
    all_descriptors = descriptor(:all)
    options = {
        :display_name => all_descriptors[I18n.default_locale],
        :include_hierarchy => true,
        :include_classification => false,
        :include_refcount => false,
        :include_properties => false,
        :filtered_children => nil,
        :children_page => 1,
        :children_per_page => 10,
        :child_count => nil
    }.merge(options)

    if options[:child_count].blank? and not options[:filtered_children].nil?
      options[:child_count] = options[:filtered_children].count
    end

    # Basic data.
    re_hash = {
        :id => id,
        :descriptor => all_descriptors,
        :display_name => options[:display_name],
        :entry_desc => entry_desc
    }

    # Hierarchy data.
    if options[:include_hierarchy]
      re_hash.merge! :children => if options[:include_hierarchy] == :with_children
                                    filtered_children = if options[:filtered_children].nil?
                                                          paginated_children(
                                                              {},
                                                              options[:children_page],
                                                              options[:children_per_page]
                                                          )
                                                        else
                                                          options[:filtered_children]
                                                        end
                                    filtered_children.map{ |child|
                                      child_hash = child.to_hash(:include_refcount => options[:include_refcount])
                                      # We also inlude a parent count here which
                                      # can be used to check whether an entry would
                                      # orphane if deleted from the child list.
                                      child_hash[:parent_count] = child.parents.size
                                      child_hash
                                    }
                                  else
                                    []
                                  end,
                     :children_page => options[:children_page].to_i,
                     :children_per_page => options[:children_per_page].to_i,
                     :child_count => options[:child_count] || children.size,
                     :parents => parents.map { |re| {:id => re.id} }
    end

    # Classification.
    if options[:include_classification]
      re_hash[:classification] = classification.map do |classfcn|
        {
            :registry_entry => classfcn[:registry_entry].to_hash,
            :registers => classfcn[:registers].map(&:to_hash)
        }
      end
    end

    # Reference count.
    if options[:include_refcount]
      re_hash[:refcount] = registry_references.size
    end

    # Additional properties.
    if options[:include_properties]
      [
          :entry_code, :latitude, :longitude, :workflow_state,
          :list_priority, :updated_at
      ].each do |property_name|
        re_hash[property_name] = send(property_name)
      end
      re_hash[:list_priority] = false if re_hash[:list_priority].nil?
      re_hash[:latitude] = re_hash[:latitude].to_f.round(6) unless re_hash[:latitude].nil?
      re_hash[:longitude] = re_hash[:longitude].to_f.round(6) unless re_hash[:longitude].nil?
    end

    re_hash
  end

  def to_xml(options = {})
    options.merge! :root => :registry_entry
    to_hash.to_xml options
  end

  private

  def deltahandling(association_name, delta_records)
    delta_records.each do |delta_record|
      registry_entry = RegistryEntry.find(delta_record[:id])
      association = self.send(association_name)
      raise 'Missing delta action.' if delta_record[:action].blank?
      existing_link = if association_name == :parents
                        links_as_descendant.find_by_ancestor_id(registry_entry.id)
                      else
                        links_as_ancestor.find_by_descendant_id(registry_entry.id)
                      end
      case delta_record[:action]
        when 'add'
          # When the link already exists we make it direct, otherwise we add a new link.
          if existing_link.nil?
            association << registry_entry
          else
            existing_link.make_direct
            existing_link.save!
          end

        when 'remove'
          raise(ActiveRecord::RecordNotFound) if existing_link.nil?
          # When the link is destroyable then destroy it, otherwise make it indirect.
          if (existing_link.destroyable?)
            # We cannot use the association.delete() method as
            # this won't trigger the destroy callback on the link
            # which leaves the DAG in an inconsistent state.
            existing_link.destroy
          else
            existing_link.make_indirect
            existing_link.save!
          end

        else
          raise "Unknown delta action: #{delta_record[:action]}"
      end
    end
  end

end
