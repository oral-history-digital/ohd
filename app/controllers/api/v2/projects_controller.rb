module Api
  module V2
    class ProjectsController < BaseController
      DEFAULT_PER_PAGE = 25
      MAX_PER_PAGE = 100
      LIST_INCLUDES = %w[counts institutions interview_languages collection_preview].freeze

      skip_before_action :authenticate_user!, only: :index
      before_action :use_global_project_context, only: :index

      def index
        all = boolean_parameter(:all)
        include_umbrella = boolean_parameter(:include_umbrella)
        invalid_parameter!(:page) if all && params.key?(:page)
        invalid_parameter!(:per_page) if all && params.key?(:per_page)
        includes = requested_includes
        invalid_parameter!(:profile) if params.key?(:profile) # Only supported in detailed project endpoints like /projects/:id
        page = positive_integer_parameter(:page, default: 1)
        per_page = positive_integer_parameter(:per_page, default: DEFAULT_PER_PAGE)
        invalid_parameter!(:per_page) if per_page > MAX_PER_PAGE
        sort_field, sort_direction = sort_options

        projects = policy_scope(Project)
        states = workflow_states
        projects = projects.where(workflow_state: states) if states
        umbrella_id = InstanceSetting.current.umbrella_project_id
        projects = projects.where.not(id: umbrella_id) unless include_umbrella || umbrella_id.nil?
        total_count = projects.count
        total_pages = (total_count + per_page - 1) / per_page
        projects = ProjectListRepository.new(projects, locale: I18n.locale).ordered(field: sort_field, direction: sort_direction)
        unless all
          # Out-of-range pages are empty, including numbers too large for a SQL offset.
          projects = page > total_pages ? projects.none : projects.limit(per_page).offset((page - 1) * per_page)
        end
        projects = projects.includes(:translations, logos: { file_attachment: :blob }, favicon_attachment: :blob)
        if includes.include?('institutions')
          projects = projects.includes(:institution_projects, institutions: [:translations, { parent: :translations }])
        end
        serializer_options = included_data(projects, includes).merge(umbrella_project_id: umbrella_id)

        render json: {
          data: projects.map { |project| ProjectListSerializer.new(project, serializer_options).as_json },
          pagination: {
            page: all ? 1 : page,
            per_page: all ? total_count : per_page,
            total_pages: all ? 1 : total_pages,
            total_count: total_count,
          },
        }
      end

      private

      def requested_includes
        return [] unless params.key?(:include)

        value = params[:include]
        invalid_parameter!(:include) unless value.is_a?(String)
        includes = value.split(',', -1).map(&:strip).uniq.sort
        invalid_parameter!(:include) if includes.empty? || (includes - LIST_INCLUDES).any?
        includes
      end

      # Batch optional queries for this page only; omitted includes do no extra work.
      def included_data(projects, includes)
        options = { requested_includes: includes }
        return options if includes.empty?

        project_ids = projects.map(&:id)
        metrics = ProjectMetricsRepository.new(project_ids)
        if includes.include?('counts')
          options[:interview_counts] = metrics.interview_counts_by_project
          options[:collection_counts] = metrics.collection_counts_by_project
        end
        options[:interview_languages] = metrics.interview_languages_by_project if includes.include?('interview_languages')
        if includes.include?('collection_preview')
          options[:collections_by_project] = CollectionContentRepository.new(
            project_ids: project_ids, collections_scope: policy_scope(Collection)
          ).collections_by_project
        end
        options
      end

      def use_global_project_context
        @current_project = nil
      end

      def workflow_states
        return unless params.key?(:workflow_state)

        value = params[:workflow_state]
        invalid_parameter!(:workflow_state) unless value.is_a?(String)
        return if value == 'all'

        states = value.split(',', -1).map(&:strip).uniq
        invalid_parameter!(:workflow_state) if states.empty? || (states - %w[public unshared]).any?
        states
      end

      def sort_options
        sort = params.fetch(:sort, '-created_at')
        invalid_parameter!(:sort) unless sort.is_a?(String)
        field = sort.delete_prefix('-')
        invalid_parameter!(:sort) unless ProjectListRepository::SORT_COLUMNS.key?(field)
        [field, sort.start_with?('-') ? :desc : :asc]
      end
    end
  end
end
