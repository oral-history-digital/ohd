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

      blocks.each do |raw_block|
        block = HomepageBlocks::Upsert.perform(
          instance_setting: @instance_setting,
          attributes: raw_block
        )

        image_attributes = raw_block['image'] || raw_block[:image]
        next if image_attributes.blank?

        HomepageBlocks::AttachImage.perform(block: block, attributes: image_attributes)
      end
    end
  end
end
