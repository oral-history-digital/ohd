class ProjectPolicy < ApplicationPolicy
  def cmdi_metadata?
    show?
  end

  def edit_info?
    update?
  end

  def edit_display?
    update?
  end

  def edit_config?
    update?
  end
end
