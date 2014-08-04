# Activate fallbacks. This will fall back to the I18n.default_locale by default.
I18n::Backend::Simple.send(:include, I18n::Backend::Fallbacks)
