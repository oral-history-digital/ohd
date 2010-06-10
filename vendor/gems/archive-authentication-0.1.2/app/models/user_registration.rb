class UserRegistration < ActiveRecord::Base

  def validate
    self.class.registration_field_names.select{|f| self.class.registration_fields[f.to_sym][:mandatory] }.each do |field|
      if self.send(field).blank?
        errors.add(field, "Angaben zu #{field} fehlen.")
      end
    end
  end

end