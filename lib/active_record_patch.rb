# Patch that allows us to set a default scope for I18n::translate() calls.

module ActiveRecord
  class Base
    class << self

      # Return a human-readable representation of the given ActiveRecord subclass and respect
      # language-specific casing rules for display in the middle of a sentence.
      def human_name_in_sentence(options = {})
        mb_human_name = self.human_name(options).mb_chars
        I18n.locale == :de ? mb_human_name : mb_human_name.downcase
      end

    end
  end
end