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
    user.admin? || user.permissions?(record.class.name, :create)
  end

  def new?
    user.admin? || user.permissions?(record.class.name, :new)
  end

  def update?
    user.admin? || user.permissions?(record.class.name, :update) || user.tasks?(record) 
  end

  def edit?
    user.admin? || user.permissions?(record.class.name, :edit) || user.tasks?(record) 
  end

  def destroy?
    user.admin? || user.permissions?(record.class.name, :destroy)
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
