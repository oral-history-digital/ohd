class UserRegistration < ActiveRecord::Base

  validates_format_of :email,
                      :with => /^.+@.+\..+$/,
                      :on => :create

  validates_acceptance_of :tos_agreement, :accept => true

  before_create :serialize_form_parameters

  def validate
    self.class.registration_field_names.select{|f| self.class.registration_fields[f.to_sym][:mandatory] }.each do |field|
      if self.send(field).blank?
        errors.add(field, "Angaben zu #{field} fehlen.")
      end
    end
  end

  private

  def serialize_form_parameters
    serialized_form_params = {}
    (User.registration_field_names - [:email, :first_name, :last_name, :tos_agreement]).each do |field|
      serialized_form_params[field.to_sym] = self.send(field)
    end
    require 'yaml'
    self.application_info = serialized_form_params.to_yaml
  end

end