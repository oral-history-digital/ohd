class InstanceSetting < ApplicationRecord
  SINGLETON_KEY = 'default'.freeze

  belongs_to :umbrella_project, class_name: 'Project'
  has_many :homepage_blocks, -> { order(:position) }, dependent: :destroy

  validates :singleton_key, inclusion: { in: [SINGLETON_KEY] }, uniqueness: true # Ensures only one instance with the singleton key exists
  validates :umbrella_project, presence: true

  def self.current
    find_by(singleton_key: SINGLETON_KEY) || create!(singleton_key: SINGLETON_KEY, umbrella_project: default_umbrella_project!)
  end

  def self.default_umbrella_project!
    shortname = ENV.fetch('UMBRELLA_PROJECT_SHORTNAME', 'ohd')
    Project.find_by(shortname: shortname) || Project.first || raise('No project available for InstanceSetting')
  end
end
