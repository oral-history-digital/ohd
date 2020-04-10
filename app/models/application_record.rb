class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def localized_hash(att)
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = self.send(att, locale) 
      mem
    end
  end

  # following method is only used in models with a worflow_state-attribute
  # these models included Workflow before, but for all of our models except 
  # UserRegistrations Workflow is useless and would just complicate things
  # or result in workarounds which kill all of it s functionality like
  # commit bc6182762df3bad2cf62421c35e346c0c61af995
  #
  def workflow_states
    ['public', 'unshared']
  end

end
