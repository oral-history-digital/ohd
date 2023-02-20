class ProjectPolicy < ApplicationPolicy

  %w(create destroy).each do |m|
    define_method "#{m}?" do
      user && user.admin?
    end
  end

  def cmdi_metadata?
    show?
  end

  def archiving_batches_index?
    show?
  end

  def archiving_batches_show?
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
