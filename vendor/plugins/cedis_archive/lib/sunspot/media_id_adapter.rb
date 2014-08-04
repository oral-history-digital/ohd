module CeDiS

  module Sunspot

    module Adapters

      class MediaIdInstanceAdapter < ::Sunspot::Adapters::InstanceAdapter
        def id
          @instance.media_id
        end
      end

      class MediaIdDataAccessor < ::Sunspot::Rails::Adapters::ActiveRecordDataAccessor

        def load(id)
          @clazz.find_by_media_id(id.to_s, options_for_find)
        end

        def load_all(ids)
          @clazz.find(options_for_find).scoped({:conditions => ['media_id IN (?)', ids.join("','") ]})
        end

      end

    end

  end
end