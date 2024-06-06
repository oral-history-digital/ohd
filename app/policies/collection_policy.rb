class CollectionPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if project.is_ohd?
        scope.all
      else
        scope.where(project_id: project.id)
      end
    end
  end
end
