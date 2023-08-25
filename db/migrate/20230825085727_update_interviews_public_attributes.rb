class UpdateInterviewsPublicAttributes < ActiveRecord::Migration[7.0]
  def up
    Interview.all.each do |i|
      i.public_attributes=({transcript: true}); i.save
    end
  end
  def down
  end
end
