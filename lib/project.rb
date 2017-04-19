module Project

  class << self

    def method_missing(n)
      if Rails.configuration.project.has_key? n.to_s 
        Rails.configuration.project[n.to_s] 
      else 
        #raise "#{self} does NOT have a key named #{n}"
        nil
      end
    end

    def name
      project_id
    end

    def keys
      Rails.configuration.project.keys
    end

  end

end

