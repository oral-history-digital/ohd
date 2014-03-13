require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UsageReport, 'when creating for a Login action' do
  before :all do
    generate_user_account
  end

  it "should find the correct user_account from the login parameter" do
    @usage_record = generate_usage_report(UsageReport::LOGIN, {:user_account => {'login' => @user_account.login}})
    @usage_record.should be_valid
    lambda{@usage_record.save}.should_not raise_exception
    @usage_record.user_account.should == @user_account
  end

  it "should find the correct user_account from a registered user_account_ip when no login param is provided" do
    @ip = '212.10.86.234'
    UserAccountIP.create do |uip|
      uip.user_account_id = @user_account.id
      uip.ip = @ip
    end
    @usage_record = generate_usage_report(UsageReport::LOGIN, {}, @ip)
    @usage_record.should be_valid
    lambda{@usage_record.save}.should_not raise_exception
    @usage_record.user_account.should == @user_account
    end
end

describe UsageReport, 'when creating for an Interview access action' do
  before :all do
    generate_interview
  end

  it "should store the archive_id in resource_id" do
    @usage_record = generate_usage_report(UsageReport::INTERVIEW, {:id => 'za123'})
    @usage_record.should be_valid
    @usage_record.resource_id.should == 'za123'
  end

  it "should store the archive_id in resource_id and materials filename in facets for material access" do
    @usage_record = generate_usage_report(UsageReport::MATERIALS, {:id => 'za234', :filename => 'za234_tr', :extension => 'pdf'})
    @usage_record.should be_valid
    @usage_record.resource_id.should == 'za234'
    @usage_record.facets = 'za234_tr'
  end
end

describe UsageReport, 'when creating for a Search request' do
  it "should parse the 'suche' parameter and store the fulltext term as query" do
    @term = 'Interviews, bitte'
    @search = Search.encode_parameters({'fulltext' => @term})
    @usage_record = generate_usage_report(UsageReport::SEARCHES, {:suche => @search})
    @usage_record.should be_valid
    @usage_record.query.should == @term
  end

  it "should store the person_name parameter fully in facets" do
    @person = 'Snowden, Edward'
    @search = Search.encode_parameters({'person_name' => @person})
    @usage_record = generate_usage_report(UsageReport::SEARCHES, {:suche => @search})
    @usage_record.should be_valid
    @usage_record.save
    @usage_record.reload.facets['person_name'].should == @person
  end

  it "should store additional facets in the facets attribute together with the number of selected categories" do
    @facets = {'forced_labor_groups' => [3,4,5], 'forced_labor_fields' => 4}
    @search = Search.encode_parameters(@facets.merge({'fulltext' => 'Krankheit im Lager'}))
    @usage_record = generate_usage_report(UsageReport::SEARCHES, {:suche => @search})
    @usage_record.save
    @usage_record.reload.facets.should == {'forced_labor_groups' => 3, 'forced_labor_fields' => 1}
  end
end

describe UsageReport, 'when creating for a Map access' do
  # country determination via geolocation should happen for the other
  # forms of access, too, but typically those are determined from a
  # user_account_ip.
  it "should determine the country from the IP for anonymous access" do
    @usage_record = generate_usage_report(UsageReport::MAP, {}, '160.45.170.45')
    @usage_record.should be_valid
    @usage_record.save
    @usage_record.country.should == 'DE'
  end
end

describe UsageReport, 'when generating the reports' do
  # These are mostly just to raise the coverage, there is no
  # much testing for functionality or correctness of content here.
  before :all do
    generate_user_account
    generate_interview
    generate_usage_report(UsageReport::LOGIN, {:user_account => {:login => @user_account.login}}).save
    generate_usage_report(UsageReport::INTERVIEW, {:id => @interview.archive_id}).save
    generate_usage_report(UsageReport::MATERIALS, {:id => @interview.archive_id, :filename => 'za234_ue', :extension => 'pdf'}).save
    generate_usage_report(UsageReport::MAP).save
    @date = UsageReport.find(:last).logged_at
  end

  it "should create a Login Report for the current month successfully" do
    lambda{UsageReport.create_logins_report(@date)}.should_not raise_exception
  end

  it "should create an Interview Access Report for the current month successfully" do
    lambda{UsageReport.create_interview_access_report(@date)}.should_not raise_exception
  end

  it "should create a Searches Report for the current month successfully" do
    lambda{UsageReport.create_searches_report(@date)}.should_not raise_exception
  end

  it "should create a Map Report for the current month successfully" do
    lambda{UsageReport.create_map_report(@date)}.should_not raise_exception
  end
end

def generate_usage_report(action, params={}, ip='213.43.9.136')
  UsageReport.new do |r|
    r.ip =ip
    r.logged_at = (Time.now - 2.months).to_s(:db)
    r.action = action
    r.parameters = params
  end
end

def generate_user_account
  @user_account = UserAccount.find(:first)
  @user_account ||= UserAccount.new do |a|
    a.email = 'm.mustermann@ohne-email.de'
    a.login = 'mmustermann'
    a.password = 'gutes_passwort'
    a.password_confirmation = 'gutes_passwort'
  end
  @user_account.save if @user_account.new_record?
end

def generate_interview
  @interview ||= Interview.create do |interview|
    interview.archive_id = 'za907'
    interview.full_title = 'Abraham Lincoln'
    interview.country_of_origin = 'Vereinigte Staaten'
  end
end