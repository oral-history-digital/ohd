# ecoding: utf-8
#
class UserRegistrationSerializer < ActiveModel::Serializer
  attributes :id,
    :first_name,
    :last_name,
    :email,
    :tos_agreement,
    :application_info,
    :workflow_state,
    :created_at,
    :activated_at,
    :admin_comments,
    :user_account_id,
    :user_id,
    :login,
    :processed_at,
    :default_locale,
    :receive_newsletter,
    :newsletter_signup,
    :priv_agreement,
    :appellation,
    :job_description,
    :research_intentions,
    :comments,
    :organization,
    :homepage,
    :street,
    :zipcode,
    :city,
    :state,
    :country,
    :transitions_to,
    :roles,
    :tasks

  def user_id
    object.user && object.user.id
  end

  def names
      object.translations.each_with_object({}) {|i, hsh |
        alpha2_locale = ISO_639.find(i.locale.to_s).alpha2
        hsh[alpha2_locale] = {
          firstname: i.first_name,
          lastname: i.last_name
        } if Project.available_locales.include?( alpha2_locale )}
  end

  def transitions_to
    object.current_state.events.map{|e| e.first}
  end

  def roles
    object.user ? object.user.roles.inject({}){|mem, c| mem[c.id] = RoleSerializer.new(c); mem} : {}
  end

  def tasks
    object.user ? object.user.tasks.inject({}){|mem, c| mem[c.id] = TaskSerializer.new(c); mem} : {}
  end

  def created_at
    object.created_at && object.created_at.strftime('%d.%m.%Y %M:%H Uhr')
  end

  def activated_at
    object.activated_at && object.activated_at.strftime('%d.%m.%Y %M:%H Uhr')
  end

  def processed_at
    object.processed_at && object.processed_at.strftime('%d.%m.%Y %M:%H Uhr')
  end

  def receive_newsletter
    object.receive_newsletter ? 'Ja' :'Nein'
  end

  def country
    ISO3166::Country.translations(:de)[YAML.load(object.application_info)[:country]]
  end

  [
    :appellation,
    :job_description,
    :research_intentions,
    :comments,
    :organization,
    :homepage,
    :street,
    :zipcode,
    :city,
    :state
  ].each do |info|
    define_method info do
      i = YAML.load(object.application_info)[info]
      i && i.force_encoding("UTF-8")
    end
  end

end
