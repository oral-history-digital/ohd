class DisplayNameCreator < ApplicationService
  def initialize(first_name: '', last_name: '', gender: :male, title: '')
    @first_name = first_name
    @last_name = last_name
    @gender = gender&.to_sym
    @title = title&.to_sym
  end

  def perform
    used_title = display_title_part

    if @first_name.blank?
      used_title.blank? ?
        "#{I18n.t("honorific.#{@gender}")} #{@last_name}" :
        "#{I18n.t("honorific.#{@gender}")} #{used_title} #{@last_name}"
    else
      used_title.blank? ?
        "#{@first_name} #{@last_name}" :
        "#{used_title} #{@first_name} #{@last_name}"
    end
  end

  def display_title_part
    used_gender = @gender == :female ? :female : :male

    if @title.present?
      I18n.t("modules.person.abbr_titles.#{@title}_#{used_gender}")
    else
      ''
    end
  end
end
