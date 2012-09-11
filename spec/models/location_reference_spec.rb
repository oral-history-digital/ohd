require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe LocationReference, 'when assigning cartesian grid coordinates' do

  before :all do
    @berlin = init_city 'Berlin', 52.31, 13.24
    @potsdam = init_city 'Potsdam', 52.24, 13.4
    @magdeburg = init_city 'Magdeburg', 52.8, 11.37
    @hamburg = init_city 'Hamburg', 52.33, 10.0
    @moskau = init_city 'Moskau', 55.45, 37.37
    @shanghai = init_city 'Shanghai', 31.14, 121.28
    @new_york = init_city 'New York', 40.43, -74.0
    @los_angeles = init_city 'Los Angeles', 34.3, -118.15
    @cape_town = init_city 'Kapstadt', -33.55, 18.25
    @tokyo = init_city 'Tokyo', 35.41, 139.46
    @cities = [@berlin, @potsdam, @magdeburg, @hamburg, @moskau, @shanghai, @new_york, @los_angeles, @cape_town, @tokyo]
  end

  it "should assign the same cartesian grid coordinates for cities that are nearby" do
    @berlin.grid_coordinates.should eql(@potsdam.grid_coordinates)
  end

  it "should assign the same cartesian x-coordinates to places on the same longitude coordinate" do
    @test_x = init_city 'X', 12.4, @berlin.longitude
    @test_x.grid_coordinates.last.should eql(@berlin.grid_coordinates.last)
  end

  it "should assign the same cartesian y-coordinate to places on the same latitude coordinate" do
    @test_y = init_city 'Y', @berlin.latitude, -93.4
    @test_y.grid_coordinates.first.should eql(@berlin.grid_coordinates.first)
  end

  it "should assign longitude grid_coordinates in the same order as the longitude" do
    grid = "AA"
    last = '-'
    long = -180
    @cities.sort{|a,b| a.longitude <=> b.longitude }.each do |city|
      if city.grid_coordinates.last < grid
        puts city.name + " [#{city.grid_coordinates.last}] at '#{city.longitude}' has less longitude than #{last} [#{grid}] at '#{long}'!?"
      end
      city.grid_coordinates.last.should >= grid
      grid = city.grid_coordinates.last
      long = city.longitude
      last = city.name
    end
  end

  it "should assign latitude grid_coordinates in the same order as the latitude" do
    grid = "AA"
    last = '-'
    lat = -90
    @cities.sort{|a,b| a.latitude <=> b.latitude }.each do |city|
      if city.grid_coordinates.first < grid
        puts city.name + " [#{city.grid_coordinates.first}] at '#{city.latitude}' has less latitude than #{last} [#{grid}] at '#{lat}'!?"
      end
      city.grid_coordinates.first.should >= grid
      grid = city.grid_coordinates.first
      lat = city.latitude
      last = city.name
    end
  end

  it "should not wrap the coordinates for longitudes from -165 to +165" do
    coords = []
    last = '-'
    (-165..165).step(10) do |longitude|
      grid = LocationReference.new{|lr| lr.longitude = longitude; lr.latitude = 10 }.grid_coordinates.last
      unless last == grid
        coords.should_not include(grid)
        coords << grid
      end
      last = grid
    end
  end

end

describe LocationReference, 'when matching boundary grid coordinates with locations' do

  before :all do
    @berlin = init_city 'Berlin', 52.31, 13.24
    @potsdam = init_city 'Potsdam', 52.24, 13.4
    @magdeburg = init_city 'Magdeburg', 52.8, 11.37
    @hamburg = init_city 'Hamburg', 52.33, 10.0
    @moskau = init_city 'Moskau', 55.45, 37.37
    @shanghai = init_city 'Shanghai', 31.14, 121.28
    @new_york = init_city 'New York', 40.43, -74.0
    @los_angeles = init_city 'Los Angeles', 34.3, -118.15
    @cape_town = init_city 'Kapstadt', -33.55, 18.25
    @tokyo = init_city 'Tokyo', 35.41, 139.46
  end

end

def init_city(name, lat, lng)
  LocationReference.create do |loc|
    loc.name = name
    loc.latitude = lat
    loc.longitude = lng
  end
end