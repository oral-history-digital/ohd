# Create a new user for development purposes.
# E.g.:
# bundle exec rake user:create['alice@example.com','password']

namespace :user do
  desc "Create new user"
  task :create, [:email, :password] => :environment do |task, args|
    email = args.email
    password = args.password

    user_account = UserAccount.new(
      login: email,
      email: email,
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
