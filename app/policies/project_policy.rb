class ProjectPolicy < ApplicationPolicy
  def edit_info?
    update?
  end

  def edit_display?
    update?
  end

  def edit_config?
    update?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
