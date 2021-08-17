class LanguagePolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user && (user.admin? || user.permissions.map(&:klass).include?(scope.to_s))
        scope.all
      else
        scope.none
      end
    end
  end
end
