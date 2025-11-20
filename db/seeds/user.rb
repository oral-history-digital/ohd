#
# Users
#

project1 = Project.first

admin_email = 'alice@example.com'
admin_password = 'Password123!'

admin_user_account = UserAccount.new(
  login: admin_email,
  email: admin_email,
  password: admin_password,
  first_name: 'Alice',
  last_name: 'Henderson',
  admin: true,
  tos_agreement: true,
  tos_agreed_at: DateTime.now,
  priv_agreement: true
)
admin_user_account.skip_confirmation!
admin_user_account.save

admin_user_registration = UserRegistration.create(
  user_account_id: admin_user_account.id,
  email: admin_email,
  tos_agreement: true,
  priv_agreement: true
)

admin_user_registration.projects << project1

admin_urp = admin_user_registration.user_registration_projects.first
admin_urp.activated_at = DateTime.now
admin_urp.save


visitor_email = 'bob@example.com'
visitor_password = 'Password123!'

visitor_user_account = UserAccount.new(
  login: visitor_email,
  email: visitor_email,
  password: visitor_password,
  first_name: 'Bob',
  last_name: 'Sanders',
  admin: false,
  tos_agreement: true,
  tos_agreed_at: DateTime.now,
  priv_agreement: true
)
visitor_user_account.skip_confirmation!
visitor_user_account.save

visitor_user_registration = UserRegistration.create(
  user_account_id: visitor_user_account.id,
  email: visitor_email,
  tos_agreement: true,
  priv_agreement: true
)

visitor_user_registration.projects << project1

visitor_urp = visitor_user_registration.user_registration_projects.first
visitor_urp.activated_at = DateTime.now
visitor_urp.save


editor_email = 'eve@example.com'
editor_password = 'Password123!'

editor_user_account = UserAccount.new(
  login: editor_email,
  email: editor_email,
  password: editor_password,
  first_name: 'Eve',
  admin: false,
  tos_agreement: true,
  tos_agreed_at: DateTime.now,
  priv_agreement: true
)
editor_user_account.skip_confirmation!
editor_user_account.save

editor_user_registration = UserRegistration.create(
  user_account_id: editor_user_account.id,
  email: editor_email,
  tos_agreement: true,
  priv_agreement: true
)

editor_user_registration.projects << project1

editor_urp = editor_user_registration.user_registration_projects.first
editor_urp.activated_at = DateTime.now
editor_urp.save
