class UpdateInterviewsPublicAttributes < ActiveRecord::Migration[7.0]
  def up
    if Project.ohd
      Interview.all.each do |i|
        i.public_attributes=({transcript: true}); i.save
      end
    end
  end
  def down
  end
end
