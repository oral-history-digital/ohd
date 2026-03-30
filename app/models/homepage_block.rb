class HomepageBlock < ApplicationRecord
  CODES = %w(hero panel_interview panel_register).freeze

  belongs_to :instance_setting, touch: true
  has_many :images, -> { where(type: 'HomepageImage') }, as: :ref, class_name: 'HomepageImage', dependent: :destroy

  translates :heading,
    :text,
    :button_primary_label,
    :button_secondary_label,
    :image_alt,
    fallbacks_for_empty_translations: true,
    touch: true
  accepts_nested_attributes_for :translations

  validates :code, inclusion: { in: CODES }, uniqueness: { scope: :instance_setting_id }
  validates :position, presence: true
  validates :button_primary_target, presence: true

  def image_for_locale(locale = I18n.locale)
    images.where(locale: locale.to_s).first || images.where(locale: [nil, '']).first || images.first
  end

end
