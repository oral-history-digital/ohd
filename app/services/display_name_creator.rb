class DisplayNameCreator < ApplicationService
  def initialize(first_name: '', last_name: '', pseudonym_first_name: '',
    pseudonym_last_name: '', use_pseudonym: false, gender: :male, title: '')
    @first_name = first_name
    @last_name = last_name
    @pseudonym_first_name = pseudonym_first_name
    @pseudonym_last_name = pseudonym_last_name
    @use_pseudonym = use_pseudonym
    @gender = gender
    @title = title
  end

  def perform
    if @use_pseudonym
      used_first_name = @pseudonym_first_name
      used_last_name = @pseudonym_last_name
    else
      used_first_name = @first_name
      used_last_name = @last_name
    end

    used_title = display_title_part

    if used_first_name.blank?
      used_title.blank? ?
        "#{I18n.t("honorific.#{@gender}")} #{used_last_name}" :
        "#{I18n.t("honorific.#{@gender}")} #{used_title} #{used_last_name}"
    else
      used_title.blank? ?
        "#{used_first_name} #{used_last_name}" :
        "#{used_title} #{used_first_name} #{used_last_name}"
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
