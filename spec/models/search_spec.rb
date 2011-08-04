require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Search, 'utilizing hashed parameters' do

  before(:all) do
    @query1 = { :fulltext => 'Selekt*' }
    @query2 = { :page => 2, :forced_labor_groups => '13,17' }
    @query3 = { :person_name => 'Bartolomäus Bracht', :fulltext => 'Dachau' }
    @query4 = { :page => 1, :fulltext => 'Hunger', :countries => ['5','12','15'], :languages => ['21','34'] }
    @query5 = { :fulltext => 'za016' }
    @queries = [ @query1, @query2, @query3, @query4, @query5 ]
  end

  it "should encode query parameters into a hashed string" do
    @queries.each do |query|
      Search.encode_parameters(query).should =~ /^[a-zA-Z0-9]+(==)?(\n)?$/
    end
  end

  it "should recreate the original query parameters when decoding the hashed string" do
    @queries.each do |query|
      hash = Search.encode_parameters(query)
      string_value_query = query.inject({}){|h,p| h[p.first.to_s] = (p.last.is_a?(Array) ? p.last.map{|v| v.to_s} : p.last.to_s) if (p.first.to_s != 'page'); h; }
      Search.decode_parameters(hash).should == string_value_query
    end
  end

  it "should not hash non-query or page parameters" do
    @query = { :page => 3, :open_category => 'forced_labor_groups', :nonsense => 'faulty', :languages => ["1"]}
    Search.decode_parameters(Search.encode_parameters(@query)).should \
      == { 'languages' => ["1"] }
  end

end