class Admin::UserRegistrationsController < Admin::BaseController

  actions :index, :edit, :update

  private

  def object
    object = UserRegistration.find(params[:id])
    @user_account = object.user_account
    @user = @user_account ? @user_account.user : nil
    object
  end

  def collection
    @workflow_state = params[:workflow_state] || 'unchecked'
    conditions = "workflow_state = '#{@workflow_state}'" + (@workflow_state == "unchecked" ? " OR workflow_state IS NULL" : "")
    @user_registrations = UserRegistration.find(:all, :conditions => conditions)
  end

end