module Devise

  module ArchiveModelExtensions

    module ActiveRecordExtension

      def self.included(recipient)
        recipient.extend(ClassMethods)
      end

      module ClassMethods

        # fields expected for the user registration
        def define_registration_fields fields
          @@registration_fields = {}
          @@registration_field_names = []
          raise "Invalid user_registration_fields for User: type #{fields.class.name}, expected Array" unless fields.is_a?(Array)
          fields.each_with_index do |field, index|
            case field
              when Hash
                name = field[:name].to_s.to_sym
                @@registration_field_names << name
                @@registration_fields[name] = { :position => index,
                                                :mandatory => field[:mandatory].nil? ? true : field[:mandatory],
                                                :type => field[:type] || :string,
                                                :translate => field[:translate].nil? ? true : field[:translate],
                                                :values => field[:values] || [] }
              else
                name = field.to_s.to_sym
                @@registration_field_names << name
                @@registration_fields[name] = { :position => index,
                                                :mandatory => true,
                                                :translate => true,
                                                :type => :string,
                                                :values => [] }
            end
          end
          @@registration_field_names.each do |field|
            next if [:email, :first_name, :last_name, :tos_agreement].include?(field)
            UserRegistration.class_eval <<EVAL
              def #{field}
                @#{field}
              end

              def #{field}=(value)
                @#{field} = value
              end
EVAL
          end
        end

        def registration_field_names
          @@registration_field_names
        end

        def registration_fields
          @@registration_fields
        end

      end

    end

  end

end