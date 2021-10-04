class PermissionPolicy < ApplicationPolicy

  %w(create update destroy).each do |m|
    define_method "#{m}?" do
      user && user.admin?
    end
  end

end
