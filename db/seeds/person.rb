project1 = Project.where(shortname: 'test').first
language1 = Language.where(code: 'en').first

person1 = Person.create(
  project: project1,
  date_of_birth: '1874/11/30',
  gender: 'male',
  first_name: 'Winston',
  last_name: 'Churchill'
)
