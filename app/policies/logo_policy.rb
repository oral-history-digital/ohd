class LogoPolicy < ApplicationPolicy

  def show?
    user == record
  end

  def update?
    show?
  end

end
