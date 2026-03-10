project1 = Project.where(shortname: 'test').first

person1 = Person.joins(:translations).where(
  project_id: project1.id,
  person_translations: { locale: 'en', first_name: 'Winston', last_name: 'Churchill' }
).first_or_initialize

person1.project = project1
person1.date_of_birth = '1874/11/30'
person1.gender = 'male'
person1.first_name = 'Winston'
person1.last_name = 'Churchill'
person1.save!
