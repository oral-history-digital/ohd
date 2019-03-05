class UserRegistrationPolicy < ApplicationPolicy

  #def new?
    #true
  #end

  #def create?
    #new?
  #end

  #def activate?
    #new?
  #end

  #def confirm?
    #new?
  #end

  def show?
    user.admin?
  end

  def subscribe?
    user.admin?
  end

  def unsubscribe?
    user.admin?
  end

  class Scope < Scope
    def resolve
      if user.admin? || user.permissions.map(&:klass).include?(scope.to_s)
        scope.all
      else
        scope.none
      end
    end
  end
end
