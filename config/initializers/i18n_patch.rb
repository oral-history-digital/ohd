# Patch that allows us to set a default scope for I18n::translate() calls.

module I18n
  class Config
    def scope
      @scope ||= default_scope
    end

    def scope=(scope)
      @scope = (scope == '' ? '' : scope.to_sym) rescue nil
    end

    def default_scope
      @@default_scope ||= nil
    end

    def default_scope=(scope)
      @@default_scope = scope.to_sym rescue nil
    end
  end

  class << self
    def scope
      config.scope
    end

    def scope=(scope)
      config.scope = scope
    end

    def default_scope
      config.default_scope
    end

    def default_scope=(default_scope)
      config.default_scope = default_scope
    end

    def translate_with_default_scope(*args)
      options = (args.last.is_a?(Hash) ? args.pop : {})
      key = args.shift
      separator = options[:separator] || self.default_separator
      if key.to_s.chars.first == separator
        options[:scope] ||= self.scope
      end
      translate_without_default_scope(key, options)
    end
    alias_method_chain :translate, :default_scope
    alias :t :translate_with_default_scope

    def with_scope(tmp_scope = nil)
      if tmp_scope
        current_scope = self.scope
        self.scope = tmp_scope
      end
      yield
    ensure
      self.scope = current_scope if tmp_scope
    end

    def locale_with_iso_conversion(three_letter_locale = nil)
      if three_letter_locale.nil?
        locale_without_iso_conversion
      else
        ISO639_TWO_AND_THREE_LETTER_MAP.invert[three_letter_locale]
      end
    end
    alias_method_chain :locale, :iso_conversion

    def three_letter_locale(two_letter_locale = I18n.locale)
      ISO639_TWO_AND_THREE_LETTER_MAP[two_letter_locale]
    end

    private

    # NB: We currently only need the translate languages here.
    # TODO: Extend this map when more translations are being added.
    ISO639_TWO_AND_THREE_LETTER_MAP = {
        :de => 'deu',
        :en => 'eng',
        :gr => 'ell',
        :ru => 'rus'
    }

  end
end
