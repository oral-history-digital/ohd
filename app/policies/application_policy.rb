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
    true
  end

  def create?
    user.admin? || user.tasks?(record) || user.permissions?(record.class_name.underscore, :create)
  end

  def new?
    user.admin? || user.tasks?(record) || user.permissions?(record.class_name.underscore, :new)
  end

  def update?
    user.admin? || user.tasks?(record) || user.permissions?(record.class_name.underscore, :update)
  end

  def edit?
    user.admin? || user.tasks?(record) || user.permissions?(record.class_name.underscore, :edit)
  end

  def destroy?
    user.admin? || user.tasks?(record) || user.permissions?(record.class_name.underscore, :destroy)
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
