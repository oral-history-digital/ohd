module Api
  module V2
    # Display details extend the summary contract and share its optional includes.
    class ProjectDisplaySerializer < ProjectListSerializer
      attributes :domain, :more_text, :primary_color, :secondary_color, :editorial_color,
        :has_map, :is_catalog, :has_newsletter, :display_ohd_link, :oai_doi_identifier

      def more_text
        localized_value(object, :more_text)
      end

      %i[has_map is_catalog has_newsletter display_ohd_link].each do |attribute|
        define_method(attribute) { object.public_send("#{attribute}?") }
      end

      def oai_doi_identifier
        object.oai_doi_identifier if object.doi_status == 'created'
      end
    end
  end
end
