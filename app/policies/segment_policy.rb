class SegmentPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user
        scope.all
      else
        scope.none
      end
    end
  end
end
