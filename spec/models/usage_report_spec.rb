require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe UsageReport do

  let(:user_account) do
    user_account = FactoryGirl.create :user_account, :password => 'gutes-passwort', :password_confirmation => 'gutes-passwort'
    user_account.confirm! user_account.password, user_account.password
    user_account
  end

  context 'when creating for a Login action' do

    let(:user_account_ip) do
      FactoryGirl.create :user_account_ip, :user_account => user_account
    end

    it 'should find the correct user_account from the login parameter' do
      usage_record = FactoryGirl.create :usage_report, :parameters => {:user_account => {'login' => user_account.login}}
      expect(usage_record).to be_valid
      expect{usage_record.save}.not_to raise_exception
      expect(usage_record.user_account).to eq(user_account)
    end

    it 'should find the correct user_account from a registered user_account_ip when no login param is provided' do
      usage_record = FactoryGirl.create :usage_report, :ip => user_account_ip.ip
      expect(usage_record).to be_valid
      expect{usage_record.save}.not_to raise_exception
      expect(usage_record.user_account).to eq(user_account)
    end

  end

  context 'when creating for an Interview access action' do

    it 'should store the archive_id in resource_id' do
      usage_record = FactoryGirl.create :usage_report, :action => UsageReport::INTERVIEW, :parameters => {:id => 'za123'}
      expect(usage_record).to be_valid
      expect(usage_record.resource_id).to eq('za123')
    end

    it 'should store the archive_id in resource_id and materials filename in facets for material access' do
      usage_record = FactoryGirl.create :usage_report, :action => UsageReport::MATERIALS, :parameters => {:id => 'za234', :filename => 'za234_tr', :extension => 'pdf'}
      expect(usage_record).to be_valid
      expect(usage_record.resource_id).to eq('za234')
      usage_record.facets = 'za234_tr'
    end

  end

  context 'when creating for a Search request' do

    it "should parse the 'suche' parameter and store the fulltext term as query" do
      term = 'Interviews, bitte'
      search = Search.encode_parameters({'fulltext' => term})
      usage_record = FactoryGirl.create :usage_report, :action => UsageReport::SEARCHES, :parameters => {:suche => search}
      expect(usage_record).to be_valid
      expect(usage_record.query).to eq(term)
    end

    # TODO: This test must be re-written when usage reports have been migrated to correct interview-id searches rather than the no longer functional person-name searches.
    it 'should store the person_name parameter fully in facets' do
      person = 'Snowden, Edward'
      search = Search.encode_parameters({'partial_person_name':  person})
      usage_record = FactoryGirl.create :usage_report, action: UsageReport::SEARCHES, parameters: {suche: search}
      expect(usage_record).to be_valid
      usage_record.save
      expect(usage_record.reload.facets['partial_person_name']).to eq(person)
    end

    it 'should store additional facets in the facets attribute together with the number of selected categories' do
      facets = {'forced_labor_groups' => [3,4,5], 'forced_labor_fields' => 4}
      search = Search.encode_parameters(facets.merge({'fulltext' => 'Krankheit im Lager'}))
      usage_record = FactoryGirl.create :usage_report, :action => UsageReport::SEARCHES, :parameters => {:suche => search}
      usage_record.save
      expect(usage_record.reload.facets).to eq({'forced_labor_groups' => 3, 'forced_labor_fields' => 1})
    end

  end

  context 'when creating for a Map access' do
    # country determination via geolocation should happen for the other
    # forms of access, too, but typically those are determined from a
    # user_account_ip.
    it 'should determine the country from the IP for anonymous access' do
      usage_record = FactoryGirl.create :usage_report, :action => UsageReport::MAP, :ip => '160.45.170.45'
      expect(usage_record).to be_valid
      usage_record.save
      expect(usage_record.country).to eq('DE')
    end
  end

  context 'when generating the reports' do

    let(:interview) do
      FactoryGirl.create :interview
    end

    # These are mostly just to raise the coverage, there is no
    # much testing for functionality or correctness of content here.
    let(:usage_reports) do
      [
        FactoryGirl.create(:usage_report, :parameters => {:user_account => {'login' => user_account.login}}),
        FactoryGirl.create(:usage_report, :action => UsageReport::INTERVIEW, :parameters => {:id => interview.archive_id}),
        FactoryGirl.create(:usage_report, :action => UsageReport::MATERIALS, :parameters => {:id => interview.archive_id, :filename => 'za234_ue', :extension => 'pdf'}),
        FactoryGirl.create(:usage_report, :action => UsageReport::MAP)
      ]
    end

    let(:date) do
      usage_reports.last.logged_at
    end

    it 'should create a Login Report for the current month successfully' do
      expect{UsageReport.create_logins_report(date)}.not_to raise_exception
    end

    it 'should create an Interview Access Report for the current month successfully' do
      expect{UsageReport.create_interview_access_report(date)}.not_to raise_exception
    end

    it 'should create a Searches Report for the current month successfully' do
      expect{UsageReport.create_searches_report(date)}.not_to raise_exception
    end

    it 'should create a Map Report for the current month successfully' do
      expect{UsageReport.create_map_report(date)}.not_to raise_exception
    end
  end

end
