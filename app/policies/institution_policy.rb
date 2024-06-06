class InstitutionPolicy < ApplicationPolicy

  %w(create update destroy).each do |m|
    define_method "#{m}?" do
      user && user.admin?
    end
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
