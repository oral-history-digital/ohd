class SetInterviewAndPersonPublicAttributes < ActiveRecord::Migration[5.2]
  def change
    interview_attributes = %w(archive_id media_type interview_date duration tape_count language_id collection_id observations)
    person_attributes = %w(first_name last_name alias_names other_first_names gender date_of_birth)
    Interview.all.each do |interview|
      interview.update_attributes properties: interview.properties.update(public_attributes: interview_attributes.inject({}){|mem, att| mem[att] = true; mem})
    end
    Person.all.each do |person| 
      person.update_attributes properties: person.properties.update(public_attributes: person_attributes.inject({}){|mem, att| mem[att] = true; mem})
    end
  end
end
