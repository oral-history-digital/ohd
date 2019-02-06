class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    user
  end

  def show?
    user
  end

  def create?
    user.admin? || user.permissions?(record.class_name.underscore, :create)
  end

  def new?
    user.admin? || user.permissions?(record.class_name.underscore, :new)
  end

  def update?
    user.admin? || user.permissions?(record.class_name.underscore, :update) || user.tasks?(record) 
  end

  def edit?
    user.admin? || user.permissions?(record.class_name.underscore, :edit) || user.tasks?(record) 
  end

  def destroy?
    user.admin? || user.permissions?(record.class_name.underscore, :destroy)
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end
end
