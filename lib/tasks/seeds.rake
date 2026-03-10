namespace :seeds do
  desc 'Validate baseline records expected after db:seed'
  task smoke: :environment do
    test_project = Project.find_by(shortname: 'test')
    ohd_project = Project.find_by(shortname: 'ohd')

    raise "Missing project 'test'" if test_project.blank?
    raise "Missing project 'ohd'" if ohd_project.blank?

    [test_project, ohd_project].each do |project|
      has_root = project.registry_entries.where(code: 'root').exists?
      raise "Missing root registry entry for project '#{project.shortname}'" unless has_root
    end

    language = Language.find_by(code: 'en')
    raise "Missing language 'en'" if language.blank?

    collection = Collection.find_by(project_id: test_project.id, shortname: 'test-collection')
    raise "Missing test collection for project 'test'" if collection.blank?

    interview = Interview.find_by(project_id: test_project.id)
    raise "Missing interview for project 'test'" if interview.blank?

    user_count = User.count
    raise 'Expected at least 3 seeded users' if user_count < 3

    linked_users = UserProject.where(project_id: test_project.id).count
    raise "Expected at least 3 user-project links for 'test'" if linked_users < 3

    puts 'Seed smoke check passed'
  end
end
