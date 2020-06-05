class AddGenderToUsers < ActiveRecord::Migration[5.2]

  def up
    female = ["Frau", "Frau Dr", "Frau Dr.", "Frau PD Dr", "Frau PD Dr.", "Frau Pro", "Frau Prof", "Frau Prof.", "ms", "ms_dr", "ms_prof", "Ms.", "Ms. PhD", "Ms. priv", "Ms. Prof", "Госпожа", "Госпожа др.", "Госпожа ПД др.", "Госпожа проф."]
    male = ["Herr", "Herr Dr", "Herr Dr.", "Herr PD Dr", "Herr PD Dr.", "Herr Pro", "Herr Prof", "Herr Prof.", "mr", "mr_dr", "mr_prof", "Mr.", "Mr. PhD", "Mr. Prof", "Господин", "Господин др.", "Господин проф."]
    dr = ["Dr.", "Dr. PhD", "Dr. PhD", "Frau Dr", "Frau Dr.", "Frau PD Dr", "Frau PD Dr.", "Herr Dr", "Herr Dr.", "Herr PD Dr", "Herr PD Dr.", "Mr. PhD", "Ms. PhD", "PD Dr.", "mr_dr", "ms_dr", "Господин др.", "Госпожа ПД др.", "Госпожа др."]
    prof = ["Frau Pro", "Frau Prof", "Frau Prof.", "Herr Pro", "Herr Prof", "Herr Prof.", "Mr. Prof", "Ms. Prof", "Prof.", "Professor", "mr_prof", "ms_prof", "Господин проф.", "Госпожа проф."]
    titles = dr + prof
    add_column :users, :gender, :string, default: ''
    User.where(appellation: female).update_all gender: 'female'
    User.where(appellation: male).update_all gender: 'male'
    User.where.not(appellation: titles).update_all appellation: ''
    User.where(appellation: dr).update_all appellation: 'dr'
    User.where(appellation: prof).update_all appellation: 'prof'
  end

 def down
    remove_column :users, :gender, :string, null: false
 end

end
