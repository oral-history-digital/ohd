class InterviewPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def dois?
    user.admin? || user.permissions?(record.class_name.underscore, :update) || user.tasks?(record) 
  end

  def doi_contents?
    show?
  end

  def initials?
    show?
  end

  def ref_tree?
    show?
  end

  def headings?
    show?
  end

  def update_speakers?
    show?
  end

end
