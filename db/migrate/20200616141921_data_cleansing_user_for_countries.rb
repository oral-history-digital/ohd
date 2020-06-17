class DataCleansingUserForCountries < ActiveRecord::Migration[5.2]

  def up
    User.where(country: 'Deutschland').update_all(country: 'DE')
  end

  def down
  end

end
