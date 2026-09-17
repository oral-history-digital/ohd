class InstanceSetting < ApplicationRecord
  SINGLETON_KEY = 'default'.freeze
  BREADCRUMB_LOGO_CONTENT_TYPES = %w(image/png image/svg+xml).freeze
  BREADCRUMB_LOGO_MAX_FILE_SIZE = 1.megabyte

  belongs_to :umbrella_project, class_name: 'Project'
  has_many :homepage_blocks, -> { order(:position) }, dependent: :destroy
  has_one_attached :breadcrumb_logo
  has_one_attached :secondary_breadcrumb_logo

  validates :singleton_key, inclusion: { in: [SINGLETON_KEY] }, uniqueness: true # Ensures only one instance with the singleton key exists
  validates :umbrella_project, presence: true
  validate :breadcrumb_logos_are_supported_images

  def self.current
    find_by(singleton_key: SINGLETON_KEY) || create!(singleton_key: SINGLETON_KEY, umbrella_project: default_umbrella_project!)
  end

  def self.default_umbrella_project!
    shortname = ENV.fetch('UMBRELLA_PROJECT_SHORTNAME', 'ohd')
    Project.find_by(shortname: shortname) || Project.first || raise('No project available for InstanceSetting')
  end

  private

  def breadcrumb_logos_are_supported_images
    %i(breadcrumb_logo secondary_breadcrumb_logo).each do |attribute|
      attachment = public_send(attribute)
      next unless attachment.attached?

      unless attachment.blob.content_type.in?(BREADCRUMB_LOGO_CONTENT_TYPES)
        errors.add(attribute, :invalid_content_type)
      end
      if attachment.blob.byte_size > BREADCRUMB_LOGO_MAX_FILE_SIZE
        errors.add(attribute, :file_too_large)
      end
    end
  end
end
