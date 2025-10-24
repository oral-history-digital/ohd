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

  # Tests for #initials method

  test 'returns initials for simple names' do
    person = Person.new(first_name: 'Alice', last_name: 'Henderson')
    assert_equal 'AH', person.initials
  end

  test 'returns empty string if both names are missing' do
    person = Person.new(first_name: nil, last_name: nil)
    assert_equal '', person.initials
  end

  test 'returns first two letters of first name if only first name exists' do
    person = Person.new(first_name: 'Peter', last_name: '')
    assert_equal 'PE', person.initials
  end

  test 'returns first two letters if only one last name exists' do
    person = Person.new(first_name: '', last_name: 'Lopez')
    assert_equal 'LO', person.initials
  end

  test 'returns first letter of first two last names if only last name exists' do
    person = Person.new(first_name: '', last_name: 'Lopez Vargas')
    assert_equal 'LV', person.initials
  end

  test 'returns single letter if only single-letter name exists' do
    person = Person.new(first_name: 'A', last_name: '')
    assert_equal 'A', person.initials
  end

  # Two surname parts

  test 'returns three letters for hyphenated surnames (Müller-Lüdenscheid)' do
    person = Person.new(first_name: 'Andrea', last_name: 'Müller-Lüdenscheid')
    assert_equal 'AML', person.initials
  end

  test 'handles hyphenated surnames with substantive parts (Li-Wang)' do
    person = Person.new(first_name: 'Alex', last_name: 'Li-Wang')
    assert_equal 'ALW', person.initials
  end

  test 'handles space-separated surnames (López Vargas)' do
    person = Person.new(first_name: 'Martina', last_name: 'López Vargas')
    assert_equal 'MLV', person.initials
  end

  # More than two surname parts

  test 'returns first letters of first two parts for last names with more than two parts (Lopez Vargas Müller)' do
    person = Person.new(first_name: 'Marta', last_name: 'Lopez Vargas Müller')
    assert_equal 'MLV', person.initials
  end

  test 'handles last names with four parts (Garcia Marquez-Lopez Vega)' do
    person = Person.new(first_name: 'Carlos', last_name: 'Garcia Marquez-Lopez Vega')
    assert_equal 'CGM', person.initials
  end

  # Single-part surname

  test 'returns two letters for regular surnames (Schmid)' do
    person = Person.new(first_name: 'Günter', last_name: 'Schmid')
    assert_equal 'GS', person.initials
  end

  test 'handles very short surnames (Li)' do
    person = Person.new(first_name: 'Alex', last_name: 'Li')
    assert_equal 'AL', person.initials
  end

  test 'handles very short surnames (Ng)' do
    person = Person.new(first_name: 'Lin', last_name: 'Ng')
    assert_equal 'LN', person.initials
  end

  test 'handles surnames with apostrophes (O\'Connor)' do
    person = Person.new(first_name: 'Chloé', last_name: "O'Connor")
    assert_equal 'CO', person.initials
  end

  # Name particles

  test 'ignores "de" particle (de Souza)' do
    person = Person.new(first_name: 'Ana', last_name: 'de Souza')
    assert_equal 'AS', person.initials
  end

  test 'ignores "da" particle (da Silva)' do
    person = Person.new(first_name: 'João', last_name: 'da Silva')
    assert_equal 'JS', person.initials
  end

  test 'ignores "El" particle (El Amrani)' do
    person = Person.new(first_name: 'Souad', last_name: 'El Amrani')
    assert_equal 'SA', person.initials
  end

  test 'ignores "El" particle with hyphen (El-Amrani)' do
    person = Person.new(first_name: 'Souad', last_name: 'El-Amrani')
    assert_equal 'SA', person.initials
  end

  test 'ignores "van der" particle (van der Berg)' do
    person = Person.new(first_name: 'Jan', last_name: 'van der Berg')
    assert_equal 'JB', person.initials
  end

  test 'ignores "von" particle (von Humboldt)' do
    person = Person.new(first_name: 'Wilhelm', last_name: 'von Humboldt')
    assert_equal 'WH', person.initials
  end

  test 'ignores "von und zu" particle (von und zu Hohenstauffen)' do
    person = Person.new(first_name: 'Wilhelm', last_name: 'von und zu Hohenstauffen')
    assert_equal 'WH', person.initials
  end

  # Diacritics handling

  test 'handles names with umlauts (Günter Müller)' do
    person = Person.new(first_name: 'Günter', last_name: 'Müller')
    assert_equal 'GM', person.initials
  end

  test 'handles names starting with umlauts (Älisia Öztürk)' do
    person = Person.new(first_name: 'Älisia', last_name: 'Öztürk')
    assert_equal 'ÄÖ', person.initials
  end

  test 'handles names with Ø (Søren Østergaard)' do
    person = Person.new(first_name: 'Søren', last_name: 'Østergaard')
    assert_equal 'SØ', person.initials
  end

  test 'handles names with accents (Étienne Dubois)' do
    person = Person.new(first_name: 'Étienne', last_name: 'Dubois')
    assert_equal 'ÉD', person.initials
  end

  test 'handles names starting with accents (Álvaro Ñúñez)' do
    person = Person.new(first_name: 'Álvaro', last_name: 'Ñúñez')
    assert_equal 'ÁÑ', person.initials
  end

  test 'handles names with accents (Łukasz Żebrowski)' do
    person = Person.new(first_name: 'Łukasz', last_name: 'Żebrowski')
    assert_equal 'ŁŻ', person.initials
  end

  # Pseudonyms

  test 'uses pseudonym names when use_pseudonym is true' do
    person.use_pseudonym = true
    person = Person.new(first_name: 'George', last_name: 'Sand')
    assert_equal 'GS', person.initials
  end

  test 'uses real names when use_pseudonym is false' do
    person.use_pseudonym = false
    person = Person.new(first_name: 'Alice', last_name: 'Henderson')
    assert_equal 'AH', person.initials
  end

  # Unicode whitespace and dash handling

  test 'handles last names with Unicode whitespace and dash characters' do
    person = Person.new(first_name: 'Lara', last_name: "Paddington\u00A0Connor\u2013Smith") # Non-breaking space and en dash
    assert_equal 'LPC', person.initials
  end

  test 'handles em dash and multiple spaces in last name' do
    person = Person.new(first_name: 'Mia', last_name: "Meier—Lüdenscheid") # em dash (U+2014)
    assert_equal 'MML', person.initials
  end

  test 'handles thin space and figure space as separators' do
    person = Person.new(first_name: 'Alex', last_name: "Li\u2009Wang") # thin space (U+2009)
    assert_equal 'ALW', person.initials
  end

  test 'handles non-breaking and narrow non-breaking space' do
    person = Person.new(first_name: 'Ana', last_name: "de\u202FSouza") # narrow no-break space (U+202F)
    assert_equal 'AS', person.initials
  end

  test 'handles en dash between name parts' do
    person = Person.new(first_name: 'Jin', last_name: "Kim–Park") # en dash (U+2013)
    assert_equal 'JKP', person.initials
  end

  test 'handles mixed dash types and extra spaces' do
    person = Person.new(first_name: 'Sara', last_name: "El – Amrani") # space + en dash + space
    assert_equal 'SA', person.initials
  end

end
