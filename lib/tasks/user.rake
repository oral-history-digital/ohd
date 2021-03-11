# Create a new user for development purposes.
# E.g.:
# bundle exec rake user:create['alice@example.com','password', 'Alice', 'Test']

namespace :user do
  desc "Create new user"
  task :create, [:email, :password, :first_name, :last_name] => :environment do |task, args|
    email = args.email
    password = args.password

    user_account = UserAccount.new(
      login: email,
      email: email,
      first_name: args.first_name,
      last_name: args.last_name,
      password: password,
      admin: true,
      tos_agreement: true,
      tos_agreed_at: DateTime.now,
      priv_agreement: true
    )
    user_account.skip_confirmation!
    user_account.save

    user_registration = UserRegistration.create(
      user_account_id: user_account.id,
      email: email,
      first_name: args.first_name,
      last_name: args.last_name,
      tos_agreement: true,
      priv_agreement: true
    )

    project = Project.first
    user_registration.projects << project

    urp = user_registration.user_registration_projects.first
    urp.activated_at = DateTime.now
    urp.save
  end
end
