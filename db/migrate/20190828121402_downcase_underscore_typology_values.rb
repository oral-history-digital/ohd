class DowncaseUnderscoreTypologyValues < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      ["Collaboration", "Concentration camp", "Concentration camp, Persecution of Jews", "Concentration camp, Resistance", "Flight", "Flight, Occupation", "Flight, Occupation, Persecution of Jews", "Flight, Persecution of Jews", "Flight, Resistance", "Occupation", "Occupation, Resistance", "Occupation, Resistance, Retaliation", "Occupation, Retaliation", "Persecution of Jews", "Persecution of Jews, Resistance", "Resistance", "Resistance, Retaliation", "Retaliation"].each do |t|
        execute "UPDATE people SET typology = '#{t.split(', ').map{|i| i.split(' ').map(&:downcase).join('_')}.join(',')}' WHERE typology='#{t}';"
      end
    end
  end
end
