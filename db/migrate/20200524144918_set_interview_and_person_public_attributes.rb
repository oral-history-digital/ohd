class SetInterviewAndPersonPublicAttributes < ActiveRecord::Migration[5.2]
  def change
    interview_attributes = %w(archive_id media_type interview_date duration tape_count language_id collection_id observations)
    person_attributes = %w(first_name last_name alias_names other_first_names gender date_of_birth)
    Interview.update_all(properties: {public_attributes: interview_attributes.inject({}){|mem, att| mem[att] = true; mem}})
    Person.update_all(properties: {public_attributes: person_attributes.inject({}){|mem, att| mem[att] = true; mem}})
  end
end
