module HomepageBlocks
  class AttachImage < ApplicationService
    ATTRIBUTES = %w(id locale title href file).freeze

    def initialize(block:, attributes:)
      @block = block
      @attributes = normalize_attributes(attributes).with_indifferent_access.slice(*ATTRIBUTES)
    end

    def perform
      image = find_image
      image.assign_attributes(image_attributes.except(:file))
      image.file.attach(image_attributes[:file]) if image_attributes[:file].present?
      image.save!
      image
    end

    private

    def find_image
      if @attributes[:id].present?
        @block.images.find(@attributes[:id])
      else
        @block.images.find_or_initialize_by(locale: @attributes[:locale])
      end
    end

    def image_attributes
      @attributes.merge(type: 'HomepageImage', ref: @block)
    end

    def normalize_attributes(attributes)
      return {} if attributes.blank?

      if attributes.is_a?(Array)
        candidate = attributes.find { |item| item.respond_to?(:with_indifferent_access) }
        return candidate || {}
      end

      attributes
    end
  end
end
