module Api
  module V2
    class ProjectListCache < ProjectReadCache
      ENDPOINT = 'projects/list'
      # Bump when response or serialization rules change without a data change.
      REVISION = 1
    end
  end
end
