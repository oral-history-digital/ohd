module Api
  module V2
    # Describes the data that can change a project-list response. Policy scopes
    # are supplied fresh by the controller, including on cache hits.
    class ProjectListCache
      # Bump when response or serialization rules change without a data change.
      REVISION = 1

      def initialize(projects:, parameters:, user:, collections_scope: nil)
        @projects = projects
        @parameters = parameters
        @includes = parameters.fetch(:includes)
        @user = user
        @collections_scope = collections_scope
      end

      def fetch
        return yield(@projects, @collections_scope) if Rails.cache.is_a?(ActiveSupport::Cache::NullStore)

        # Use the same allowed IDs for the key and response. A grant made during
        # serialization must not put newly visible records under an earlier key.
        @project_ids = @projects.reorder(nil).pluck(:id)
        @projects = Project.where(id: @project_ids)
        if @collections_scope
          visible_ids = @collections_scope.where(project_id: @project_ids).reorder(nil).pluck(:id)
          @collections_scope = Collection.where(id: visible_ids)
        end

        ResponseCache.fetch(
          endpoint: 'projects/list', revision: REVISION, parameters: @parameters,
          access: @user ? ['user', @user.id, @user.admin?] : ['anonymous'],
          dependencies: dependencies
        ) { yield(@projects, @collections_scope) }
      end

      private

      def dependencies
        result = {
          projects: fingerprint(@projects, :shortname, :display_shortname, :archive_domain,
            :workflow_state, :publication_date, :available_locales, :default_locale,
            :grant_access_without_login, :grant_project_access_instantly, :created_at),
          translations: fingerprint(Project.translation_class.where(project_id: @project_ids),
            :project_id, :locale, :name, :display_name, :introduction),
        }
        add_branding(result)
        if (@includes & %w[counts interview_languages]).any?
          interviews = Interview.where(project_id: @project_ids)
          result[:interviews] = fingerprint(interviews, :project_id, :workflow_state)
          if @includes.include?('interview_languages')
            links = InterviewLanguage.where(interview_id: interviews.select(:id))
            result[:interview_languages] = fingerprint(links, :interview_id, :language_id)
            result[:languages] = fingerprint(Language.where(id: links.select(:language_id)), :code)
          end
        end
        if @includes.include?('counts')
          result[:collection_counts] = fingerprint(Collection.where(project_id: @project_ids), :project_id, :workflow_state)
        end
        if @includes.include?('collection_preview')
          # Membership of this scope is part of the fingerprint. Permission
          # revocation changes the key even when no collection record changes.
          collections = @collections_scope.where(project_id: @project_ids)
          result[:visible_collections] = fingerprint(collections, :project_id)
          result[:collection_translations] = fingerprint(
            Collection.translation_class.where(collection_id: collections.select(:id)),
            :collection_id, :locale, :name, :notes
          )
        end
        add_institutions(result) if @includes.include?('institutions')
        result
      end

      def add_branding(result)
        logos = Logo.where(ref_type: 'Project', ref_id: @project_ids)
        result[:logos] = fingerprint(logos, :ref_id, :locale)
        attachments = ActiveStorage::Attachment.where(record_type: 'Project', record_id: @project_ids, name: 'favicon')
          .or(ActiveStorage::Attachment.where(record_type: 'UploadedFile', record_id: logos.select(:id), name: 'file'))
        result[:attachments] = fingerprint(attachments, :record_type, :record_id, :name, :blob_id)
        result[:blobs] = fingerprint(ActiveStorage::Blob.where(id: attachments.select(:blob_id)), :key, :filename)
      end

      def add_institutions(result)
        links = InstitutionProject.where(project_id: @project_ids)
        result[:institution_links] = fingerprint(links, :project_id, :institution_id, :primary)
        children = Institution.where(id: links.select(:institution_id))
        institutions = children.or(Institution.where(id: children.select(:parent_id)))
        result[:institutions] = fingerprint(institutions, :parent_id)
        result[:institution_translations] = fingerprint(
          Institution.translation_class.where(institution_id: institutions.select(:id)), :institution_id, :locale, :name
        )
      end

      # Several legacy tables have second-precision timestamps or none at all.
      # Hash the relevant stored values in SQL so rapid edits, deletions and
      # reassignment are detected without loading records or transferring texts.
      # This covers all matching projects, so list ordering and totals stay fresh.
      def fingerprint(scope, *columns)
        table = scope.klass.arel_table
        values = Arel::Nodes::NamedFunction.new('JSON_ARRAY', [:id, *columns].map { |column| table[column] })
        digest = Arel::Nodes::NamedFunction.new('SHA2', [values, Arel::Nodes.build_quoted(256)])
        Digest::SHA256.hexdigest(scope.reorder(table[:id]).pluck(digest).join)
      end
    end
  end
end
