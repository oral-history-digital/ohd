module HomepageBlocks
  class Upsert < ApplicationService
    ATTRIBUTES = %w(
      id
      code
      position
      button_primary_target
      button_secondary_target
      show_secondary_button
      translations_attributes
    ).freeze

    def initialize(instance_setting:, attributes:)
      @instance_setting = instance_setting
      @attributes = attributes.with_indifferent_access.slice(*ATTRIBUTES)
    end

    def perform
      block = find_block
      block.assign_attributes(block_attributes)
      block.save!
      block
    end

    private

    def find_block
      if @attributes[:id].present?
        @instance_setting.homepage_blocks.find(@attributes[:id])
      else
        @instance_setting.homepage_blocks.find_or_initialize_by(code: @attributes[:code])
      end
    end

    def block_attributes
      @attributes.except(:id)
    end
  end
end
