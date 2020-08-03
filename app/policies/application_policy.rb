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
    user.admin? || user.permissions?(resolve_class_name(record), :create)
  end

  def new?
    user.admin? || user.permissions?(resolve_class_name(record), :new)
  end

  def update?
    user.admin? || user.permissions?(resolve_class_name(record), :update) #|| user.tasks?(record) 
  end

  def edit?
    user.admin? || user.permissions?(resolve_class_name(record), :edit) #|| user.tasks?(record) 
  end

  def destroy?
    user.admin? || user.permissions?(resolve_class_name(record), :destroy)
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

  private
    def resolve_class_name(record)
      record.respond_to?(:class_name) ? record.class_name : record.class.name
    end
end
