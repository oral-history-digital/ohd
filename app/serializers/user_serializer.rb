class UserSerializer < ApplicationSerializer
  attributes :id,
    :first_name,
    :last_name,
    :email,
    :admin,
    :tos_agreement,
    :created_at,
    :confirmed_at,
    :user_id,
    :processed_at,
    :default_locale,
    :receive_newsletter,
    :priv_agreement,
    :appellation,
    :gender,
    :job_description,
    :research_intentions,
    :specification,
    :organization,
    :homepage,
    :street,
    :zipcode,
    :city,
    :state,
    :country,
    :user_roles,
    :permissions,
    :user_projects,
    :tasks,
    :supervised_tasks,
    :workflow_state,
    :workflow_states,
    :access_token

  def user_id
    object.id
  end

  def names
      object.translations.each_with_object({}) {|i, hsh |
        alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
        hsh[alpha2_locale] = {
          firstname: i.first_name,
          lastname: i.last_name
        } if I18n.available_locales.include?( alpha2_locale )}
  end

  def user_roles
    object.user_roles.inject({}){|mem, c| mem[c.id] = UserRoleSerializer.new(c); mem}
  end

  def tasks
    object.tasks.inject({}){|mem, c| mem[c.id] = TaskSerializer.new(c); mem}
  end

  def supervised_tasks
    object.supervised_tasks.inject({}){|mem, c| mem[c.id] = TaskSerializer.new(c); mem}
  end

  def permissions
    object.permissions.inject({}){|mem, c| mem[c.id] = PermissionSerializer.new(c); mem}
  end

  def user_projects
    object.user_projects.inject({}){|mem, c| mem[c.id] = UserProjectSerializer.new(c); mem}
  end

  def access_token
    last_access_token = object.access_tokens.last
    last_access_token && last_access_token.token
  end

  def created_at
    object.created_at && object.created_at.strftime('%d.%m.%Y %H:%M')
  end

  def confirmed_at
    object.confirmed_at && object.confirmed_at.to_f * 1000
  end

  def processed_at
    object.processed_at && object.processed_at.strftime('%d.%m.%Y %H:%M Uhr')
  end

  def receive_newsletter
    object.receive_newsletter ? 'Ja' :'Nein'
  end

  def country
    ISO3166::Country.translations(:de)[object.country]
  end
end
