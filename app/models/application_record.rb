class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def localized_hash(att)
    if self.respond_to?(:translations)
      self.send(:translations).inject({}) do |mem, t|
        mem[t.locale] = self.send(att, t.locale) 
        mem
      end
    else
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = self.send(att, locale) 
        mem
      end
    end
  end

  # following method is only used in models with a worflow_state-attribute
  # these models included Workflow before, but for most of our models except 
  # UserRegistration and Task Workflow is useless and would just complicate things
  # or result in workarounds which kill all of it s functionality like
  # commit bc6182762df3bad2cf62421c35e346c0c61af995
  #
  def workflow_states
    ['public', 'unshared']
  end

end
