module ZWAR

  module Sunspot

    module DSL

      module FieldsPatch
        # extend Sunspot::DSL::Fields

        def instantiated_from_index
          # TODO: set a class method 'instantiaed_from_index?' depending on config
          self.class.class_eval <<DEF
            def instantiated_from_index?
              true
            end
DEF
        end

      end

    end

    # IndexDataAccessor is an Adapter that creates read-only
    # AR instances directly from stored fields in the Solr index.
    class IndexDataAccessor < Sunspot::Adapters::DataAccessor
      # TODO: accept the raw result hit as initializing param
    end

    module SearchPatch
      # extend Sunspot::Search

      module InstanceMethods

        # TODO: this needs to tie in search#data_accessor_for for classes that are instantiated_from_index?
        def data_accessor_for(clazz)
          super(clazz)
        end

        # TODO: needs to pass raw hit data for classes that are instantiated_from_index?
        def populate_hits!

        end

      end

    end

  end

end