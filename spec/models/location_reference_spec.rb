require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe LocationReference, 'when importing as different location types' do

  let(:interview) do
    Interview.create \
        :archive_id => 'za908',
        :first_name => 'Iryna',
        :last_name => 'Golchova',
        :country_of_origin => 'Ukraine'
  end

  let(:tape) do
    Tape.create \
        :media_id => 'ZA908_01_01',
        :interview => interview
  end

  let(:segment) do
    @@segment ||= tape.segments.create \
        :media_id => 'ZA908_01_01_0001',
        :timecode => '00:00:02.18',
        :transcript => 'Damals waren wir in Berlin-Tempelhof...',
        :translation => '',
        :interview_id => interview.id
  end

  it 'will create a normal location when place_type is nil' do
    location = init_location(segment, 'Berlin-Tempelhof', nil, nil)
    location.location_type.should == 'Location'
    location.name.should == 'Berlin-Tempelhof'
  end

  it 'will create a camp location when place_type is Camp' do
    name = 'Berlin-Tempelhof'
    camp = init_location(segment, name, 'Camp', 'Lager')
    camp.location_type.should == 'Camp'
    camp.location_name.should include('Lager') # to ensure that camp_name is used to set
  end

  it 'will create a company location when place_type is Company' do
    name = 'Flughafenwerke Berlin-Tempelhof'
    company = init_location(segment, name, 'Company', nil)
    company.location_type.should == 'Company'
    company.location_name.should include('GmbH') # to ensure that company_name is used to set
  end

  it 'will set the exact coordinates when place_type is Camp' do
    camp = init_location(segment, 'Durchgangslager Columbiadamm', 'Camp', 'Lager')
    camp.latitude.should =~ /^\d{2}\.\d{6}$/
    camp.longitude.should =~ /^\d{2}\.\d{6}$/
  end

  it 'will set the exact coordinates when place_type is Company' do
    company = init_location(segment, 'BSR', 'Company', nil)
    company.latitude.should =~ /^\d{2}\.\d{6}$/
    company.longitude.should =~ /^\d{2}\.\d{6}$/
  end

  it 'will include the camp_aliases as alias_names when place_type is Camp' do
    name = 'Mehringhof'
    camp = init_location(segment, name, 'Camp', nil)
    camp.alias_location_names.split('; ').should include(name.reverse)
  end

  it 'will store a Camp\'s type classification in place_subtype' do
    name = 'Arbeitslager Viktoriapark'
    camp_type = 'Fiktives Lager'
    camp = init_location(segment, name, 'Camp', camp_type)
    camp.place_subtype = camp_type
  end

end


def init_location(reference, name, type, subtype)
  LocationReference.create do |loc|
    loc.name = name
    loc.location_name = name
    loc.interview = reference.interview
    loc.reference_type = 'forced_labor_location'
    loc.latitude = '52.4'
    loc.longitude = '13.4'
    loc.location_type = type
    loc.camp_type = subtype unless subtype.blank?
    case (type || '').downcase
      when 'camp'
        loc.camp_name = 'Lager ' + name
        loc.camp_alias_names = name.to_s.reverse
        loc.exact_latitude = '52.466667'
        loc.exact_longitude = '13.383333'
      when 'company'
        loc.company_name = name + ' GmbH'
        loc.company_alias_names = name.to_s.reverse
        loc.exact_latitude = '52.466667'
        loc.exact_longitude = '13.383333'
      else
    end
  end
end
