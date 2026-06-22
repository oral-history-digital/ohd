language1 = Language.find_or_initialize_by(code: 'en')
language1.name = 'English' if language1.respond_to?(:name=)
language1.save!
