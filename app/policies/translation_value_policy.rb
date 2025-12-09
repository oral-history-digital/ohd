class TranslationValuePolicy < ApplicationPolicy

  %w(create update destroy).each do |m|
    define_method "#{m}?" do
      user && user.admin?
    end
  end

  class Scope < Scope
    def resolve
      if user && (user.admin? || user.permissions.map(&:klass).include?(scope.to_s))
        scope.all.includes(:translations)
      else
        scope.none
      end
    end
  end
end

