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
      if user.admin?
        scope.all
      else
        []
      end
    end
  end
end
