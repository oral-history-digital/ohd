require "test_helper"

class PersonTest < ActiveSupport::TestCase
  def setup
    @person = nil
  end

  def person
    @person ||= Person.find_by!(last_name: 'Dupont')
  end

  test 'returns real first name' do
    assert_equal 'Jean', person.first_name_used
  end

  test 'returns pseudonym first name if use_pseudonym is set' do
    person.use_pseudonym = true
    person.pseudonym_first_name = 'George'

    assert_equal 'George', person.first_name_used
  end
end
