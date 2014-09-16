require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Search, 'utilizing hashed parameters' do

  before(:all) do
    @query1 = { :fulltext => 'Selekt*' }
    @query2 = { :page => 2, :forced_labor_groups => '13,17' }
    @query3 = { :interview_id => '517', :fulltext => 'Dachau' }
    @query4 = { :page => 1, :fulltext => 'Hunger', :home_locations => ['5','12','15'], :language_id => ['21','34'] }
    @query5 = { :fulltext => 'za016' }
    @queries = [ @query1, @query2, @query3, @query4, @query5 ]
  end

  it "should encode query parameters into a hashed string" do
    @queries.each do |query|
      Search.encode_parameters(query).should =~ /^[a-zA-Z0-9]+={0,2}(\n)?$/
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
    @query = { :page => 3, :open_category => 'forced_labor_groups', :nonsense => 'faulty', :language_id => ["1"]}
    Search.decode_parameters(Search.encode_parameters(@query)).should \
      == { 'language_id' => ["1"] }
  end

end

describe Search, 'when saving as a UserContent' do

  before(:all) do
    @content_attributes = {"title"=>"Search 'berlin' 22.09.2011 16:02", "interview_references"=>"za251,za571,za061,za194,za253", "properties"=> {:query => {:forced_labor_groups => %w(107 118), :fulltext => 'berlin', :hits => 25, :query_hash => 'ZmxnPVsiMTA3IiwgIjExOCJdfGY9YmVybGlu' }}}
  end

  it "should store the query in the properties and serialize them as YAML" do
    @search = Search.create(@content_attributes)
    @search.user = User.create{|u| u.first_name = 'Jan'; u.last_name = 'Rietema' }
    @search.should be_valid
    @search.get_properties.should == @content_attributes['properties']
  end

end
