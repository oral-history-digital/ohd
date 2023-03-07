# encoding: utf-8
#
class UserRegistrationSerializer < ApplicationSerializer
  attributes :id,
    :first_name,
    :last_name,
    :email,
    :tos_agreement,
    :application_info,
    :created_at,
    :activated_at,
    :user_account_id,
    :processed_at,
    :default_locale,
    :receive_newsletter,
    :priv_agreement,
    :appellation,
    :gender,
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
    :user_roles,
    :user_registration_projects,
    :tasks,
    :workflow_state,
    :workflow_states,

  def user_account_id
    object.user_account && object.user_account.id
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
    object.user_account ? object.user_account.user_roles.inject({}) do |mem, c|
      mem[c.id] = cache_single(c.role.project, c) if c.role.project
      mem
    end : {}
  end

  def user_registration_projects
    object.user_registration_projects.inject({}) do |mem, c|
      mem[c.id] = cache_single(c.project, c) if c.project
      mem
    end
  end

  def tasks
    object.user_account ? object.user_account.tasks.inject({}) do |mem, c|
      mem[c.id] = cache_single(c.interview.project, c) if c.interview.project
      mem
    end : {}
  end

  def created_at
    object.created_at && object.created_at.strftime('%d.%m.%Y %H:%M')
  end

  def activated_at
    object.activated_at && object.activated_at.strftime('%d.%m.%Y %H:%M Uhr')
  end

  def processed_at
    object.processed_at && object.processed_at.strftime('%d.%m.%Y %H:%M Uhr')
  end

  def receive_newsletter
    object.receive_newsletter ? 'Ja' :'Nein'
  end

  def country
    ISO3166::Country.translations(:de)[YAML.load(object.application_info)[:country]]
  end

  [
    :appellation,
    :gender,
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
