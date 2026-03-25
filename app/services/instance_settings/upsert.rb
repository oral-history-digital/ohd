module InstanceSettings
  class Upsert < ApplicationService
    def initialize(instance_setting:, attributes:)
      @instance_setting = instance_setting
      @attributes = attributes
    end

    def perform
      ActiveRecord::Base.transaction do
        update_setting!
        upsert_blocks!
      end

      @instance_setting.reload
    end

    private

    def update_setting!
      umbrella_project_id = @attributes['umbrella_project_id'] || @attributes[:umbrella_project_id]
      return if umbrella_project_id.blank?

      @instance_setting.update!(umbrella_project_id: umbrella_project_id)
    end

    def upsert_blocks!
      blocks = @attributes['blocks'] || @attributes[:blocks] || []

      normalize_blocks(blocks).each do |raw_block|
        block = HomepageBlocks::Upsert.perform(
          instance_setting: @instance_setting,
          attributes: raw_block
        )

        image_attributes = raw_block['image'] || raw_block[:image]

        normalize_images(image_attributes).each do |attributes|
          HomepageBlocks::AttachImage.perform(block: block, attributes: attributes)
        end
      end
    end

    def normalize_images(image_attributes)
      return [] if image_attributes.blank?

      return image_attributes.compact if image_attributes.is_a?(Array)

      [image_attributes]
    end

    def normalize_blocks(blocks)
      return [] if blocks.blank?

      return blocks.compact if blocks.is_a?(Array)
      return blocks.values.compact if blocks.is_a?(Hash)

      [blocks]
    end
  end
end
