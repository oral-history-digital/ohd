class LogoPolicy < ApplicationPolicy

  def show?
    user == record
  end

  def update?
    show
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
