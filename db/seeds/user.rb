#
# Users
#

project1 = Project.find_by!(shortname: 'test')

seed_users = [
  {
    email: 'alice@example.com',
    first_name: 'Alice',
    last_name: 'Henderson',
    admin: true
  },
  {
    email: 'bob@example.com',
    first_name: 'Bob',
    last_name: 'Sanders',
    admin: false
  },
  {
    email: 'eve@example.com',
    first_name: 'Eve',
    last_name: 'Miller',
    admin: false
  }
]

seed_users.each do |attrs|
  user = User.find_or_initialize_by(email: attrs[:email])
  user.login = attrs[:email]
  user.password = 'Password123!' if user.new_record?
  user.password_confirmation = 'Password123!' if user.new_record?
  user.first_name = attrs[:first_name]
  user.last_name = attrs[:last_name]
  user.admin = attrs[:admin]
  user.tos_agreement = true
  user.priv_agreement = true
  user.tos_agreed_at ||= Time.current
  user.street ||= 'Example Street 1'
  user.city ||= 'Berlin'
  user.country ||= 'Germany'
  user.confirmed_at ||= Time.current
  user.save!

  user_project = UserProject.find_or_initialize_by(user: user, project: project1)
  user_project[:workflow_state] ||= 'project_access_granted'
  user_project.activated_at ||= Time.current
  user_project.processed_at ||= Time.current
  user_project.tos_agreement = true
  user_project.save!
end
