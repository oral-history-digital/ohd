class UserRegistrationsController < ResourceController::Base

  actions :new, :create

  create do
    before do
      puts "\n@@@@ USER REGISTRATION:"
      puts "PARAMS: #{object_params.inspect}"
      puts object.inspect
    end
    wants.html do
      render :action => 'submitted'
    end
  end

  create.flash I18n.t(:successful, :scope => 'devise.registrations')
  
end