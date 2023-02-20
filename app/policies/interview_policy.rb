class InterviewPolicy < ApplicationPolicy

  def dois?
    create?
  end

  def doi_contents?
    show?
  end

  def speaker_designations?
    dois?
  end

  def ref_tree?
    show?
  end

  def headings?
    show?
  end

  def update_speakers?
    dois?
  end

  def mark_texts?
    dois?
  end

  def reload_translations?
    user
  end

  def transcript?
    user && (user.accessible_projects.include?(project) || user.admin?)
  end

  def observations?
    transcript?
  end

  def export_photos?
    download?
  end

  def export_all?
    download?
  end

  Interview.non_public_method_names.each do |m|
    define_method "#{m}?" do
      user
    end
  end

end
