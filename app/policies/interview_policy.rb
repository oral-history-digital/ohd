class InterviewPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def dois?
    user.admin? || user.permissions?(record.class.name, :update) || user.tasks?(record) 
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

end
