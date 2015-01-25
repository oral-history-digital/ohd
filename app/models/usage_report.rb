class UsageReport < ActiveRecord::Base

  belongs_to :user_account

  LOGIN = 'SessionsController#create'
  INTERVIEW = 'InterviewsController#show'
  MATERIALS = 'InterviewsController#text_materials'
  SEARCHES = 'SearchesController#query'
  MAP = 'RegistryReferencesController#map_frame'

  TRACKED_ACTIONS = [
      LOGIN,
      INTERVIEW,
      MATERIALS,
      SEARCHES,
      MAP
  ]

  validates_presence_of :logged_at
  validates_presence_of :action
  validates_inclusion_of :action, :in => TRACKED_ACTIONS

  named_scope :logged_in_month, lambda{|date| {:conditions => {:logged_at => date.beginning_of_month..date.end_of_month}}}
  named_scope :logins, {:conditions => {:action => LOGIN}}
  named_scope :interviews, {:conditions => {:action => [INTERVIEW, MATERIALS]}}
  named_scope :searches, {:conditions => {:action => SEARCHES}}
  named_scope :maps, {:conditions => {:action => MAP}}

  def validate
    case action
      when LOGIN
        validate_user_account
      when INTERVIEW
        validate_archive_id
      when MATERIALS
        validate_archive_id
        unless facets.match(Regexp.new("^#{CeDiS.config.project_initials}\\d{3}_\\w{2,4}", Regexp::IGNORECASE))
          errors.add_to_base('Incorrect or missing filename parameter for text materials request')
        end
      when SEARCHES
        # validate_user_account
      when MAP
        # nothing
      else
        # nothing - should not be valid
    end
  end

  def verb=(verb)
    @verb = verb
  end

  def parameters=(params)
    @parameters = (params || {}).symbolize_keys
    case action
      when LOGIN
        # use login for later assignment of user_account
        @login = @parameters[:user_account].blank? ? nil : @parameters[:user_account]['login']
      when INTERVIEW
        self.resource_id = @parameters[:id]
      when MATERIALS
        self.resource_id = @parameters[:id]
        self.facets = [@parameters[:filename], @parameters[:extension]].compact.join('.')
      when SEARCHES
        unless @parameters[:suche].blank?
          query_params = Search.decode_parameters @parameters[:suche]
          self.query = query_params.delete('fulltext')
          query_params.keys.each do |p|
            next if p == 'partial_person_name' # leave person_name unchanged
            value = query_params[p]
            query_params[p] = value.is_a?(Array) ? value.size : value.split(',').size
          end
          self.facets = query_params
        end
      else
    end
  end

  def login
    @login
  end

  def facets
    @facets ||= (YAML.load(read_attribute(:facets).to_s || '') || {})
  end

  # resolve country from user data or geolocation
  def country
    require 'net/http'
    require 'uri'
    @@geolocation_base ||= 'http://freegeoip.net/csv'
    @@resolved_ips ||= {}
    # check user country or IP geolocation
    # add to country row and specific_range column
    # use freegeoip.net/csv/{ip} - "ip","DE","Germany"
    country = nil
    if self.user_account && self.user_account.user
      country = self.user_account.user.country.upcase
    else
      if @@resolved_ips.keys.include?(self.ip)
        country = @@resolved_ips[self.ip]
      else
        geolocation = URI.parse([@@geolocation_base, self.ip].join('/'))
        res = Net::HTTP.get_response(geolocation)
        if(res.is_a?(Net::HTTPSuccess))
          response = (res.body || '').split(',').map{|p| p.gsub('"','').strip}
          if response.is_a?(Array) && response.first == self.ip
            country = response[1]
            @@resolved_ips[self.ip] = country
          end
        end
      end
    end
    country
  end

  # Returns an array of datetime representing the start of months that are covered by reports
  def self.months_covered
    [ UsageReport.first(:order => "logged_at ASC", :conditions => "logged_at LIKE '%-01 %'").logged_at,
      (UsageReport.last(:order => "logged_at ASC", :conditions => "logged_at LIKE '%-01 %'").logged_at - 1.month)
    ]
  end

  def self.create_reports(date)
    UsageReport.create_logins_report(date)
    UsageReport.create_interview_access_report(date)
    UsageReport.create_searches_report(date)
    UsageReport.create_map_report(date)
  end

  def self.create_logins_report(date)
    login_reports = UsageReport.logged_in_month(date).logins.scoped({:include => :user_account})
    timeframes = [:total,0..999,0..1,1..2,2..3,4..6,6..12,12..999]
    timeframe_titles = ['Logins insgesamt',
                        'Logins verifizierter Nutzer',
                        'Erstanmeldung vor max. 1 Monat',
                        '1 bis 2 Monate',
                        '2 bis 3 Monate',
                        '4 bis 6 Monate',
                        '6 bis 12 Monate',
                        'vor 12 oder mehr Monaten']
    logins = {:total => 0, :users => []}
    logins_per_country = {nil => {:total => 0, :users => []}}
    timeframes.each{|t| logins[t] = 0}
    login_reports.each do |r|
      logins[:total] += 1

      # check user country or IP geolocation
      # add to country row and specific_range column
      # use freegeoip.net/csv/{ip} - "ip","DE","Germany"
      country = r.country
      logins_per_country[country] ||= {:total => 0, :users => []}
      logins_per_country[country][:total] += 1

      # data per timeframe columns
      if r.user_account
        time = (r.logged_at - (r.user_account.confirmed_at || r.user_account.confirmation_sent_at)) / 1.month
        timeframes.each do |range|
          next unless range.is_a?(Range)
          if time >= range.first && time < range.last
            logins[range] += 1
            logins_per_country[country][range] ||= 0
            logins_per_country[country][range] += 1
          end
        end
        # add unique users
        unless logins[:users].include?(r.user_account_id)
          logins[:users] << r.user_account_id
        end
        unless logins_per_country[country][:users].include?(r.user_account_id)
          logins_per_country[country][:users] << r.user_account_id
        end
      end

    end
    sorted_countries = []
    logins_per_country.keys.compact.each do |country|
      sorted_countries << [country, logins_per_country[country][:total]]
    end
    sorted_countries.sort!{|a,b| b.last <=> a.last}

    data = []
    row = ['Land', 'Nutzer'] + timeframe_titles
    data << row
    row = ['Alle', logins[:users].size] + timeframes.map{|r| logins[r].to_s}
    data << row
    ([[nil, 0]] + sorted_countries).each do |entry|
      country = entry.first
      row = [UsageReport.country_name(country) || '?']
      row << logins_per_country[country][:users].size
      timeframes.each do |r|
        row << logins_per_country[country][r] || '0'
      end
      data << row
    end
    puts "Logins im Monat #{date.month} #{date.year}:"
    data.each do |row|
      puts row.map{|i| i.to_s.rjust(8)}.join('|')
    end
    name = "Loginstatistik-#{date.year}-#{date.month.to_s.rjust(2,'0')}.csv"
    puts "Saving to #{name}..."
    UsageReport.save_report_file(name, data)
  end

  def self.create_interview_access_report(date)
    reports = UsageReport.logged_in_month(date).interviews.scoped({:include => :user_account})
    interview_access = {:total => {}, :users => []}
    countries = {}
    resources = {}
    archive_ids = {}
    reports.each do |report|
      archive_id = report.resource_id
      archive_ids[archive_id] ||= 0
      archive_ids[archive_id] += 1
      country = report.country
      countries[country] ||= 0
      countries[country] += 1
      resource = report.facets.blank? ? 'Interview' : report.facets.downcase.sub("#{archive_id}_",'')
      resources[resource] ||= 0
      resources[resource] += 1
      interview_access[:total][:any] ||= 0
      interview_access[:total][:any] += 1
      interview_access[:total][country] ||= 0
      interview_access[:total][country] += 1
      interview_access[:total][resource] ||= 0
      interview_access[:total][resource] += 1
      interview_access[archive_id] ||= {:total => 0}
      interview_access[archive_id][:total] += 1
      interview_access[archive_id][country] ||= 0
      interview_access[archive_id][country] += 1
      interview_access[archive_id][resource] ||= 0
      interview_access[archive_id][resource] += 1
      interview_access[archive_id][:users] ||= []
      unless report.user_account_id.blank?
        unless interview_access[:users].include?(report.user_account_id)
          interview_access[:users] << report.user_account_id
        end
        unless interview_access[archive_id][:users].include?(report.user_account_id)
          interview_access[archive_id][:users] << report.user_account_id
        end
      end
    end
    sorted_archive_ids = archive_ids.to_a.sort{|a,b| b.last <=> a.last }.map{|i| i.first}
    sorted_countries = countries.to_a.sort{|a,b| b.last <=> a.last}.map{|c| c.first}
    sorted_resources = resources.to_a.sort{|a,b| b.last <=> a.last}.map{|r| r.first}
    data = []
    row = %w(Archiv-ID Aufrufe Nutzer) + sorted_resources + sorted_countries.map{|c| UsageReport.country_name(c)}
    data << row
    ([:any] + sorted_archive_ids).each do |id|
      row = []
      record = case id
                 when :any
                   row << 'Insgesamt'
                   row << interview_access[:total][:any]
                   row << interview_access[:users].size
                   interview_access[:total]
                 else
                   row << id
                   row << interview_access[id][:total]
                   row << interview_access[id][:users].size
                   interview_access[id]
               end
      sorted_resources.each do |resource|
        row << record[resource]
      end
      sorted_countries.each do |country|
        row << record[country]
      end
      data << row
    end

    puts "Interview-Aufrufe im Monat #{date.month} #{date.year}:"
    data.each do |row|
      puts row.map{|i| i.to_s.rjust(8)}.join('|')
    end
    name = "Interviewstatistik-#{date.year}-#{date.month.to_s.rjust(2,'0')}.csv"
    puts "Saving to #{name}..."
    UsageReport.save_report_file(name, data)
  end

  def self.create_searches_report(date)
    reports = UsageReport.logged_in_month(date).searches.scoped({:include => :user_account})
    searches = {:total => {:total => 0, :users => []}}
    queries = {}
    facets = {}
    countries = {}
    reports.each do |report|
      query = report.query
      person = report.facets['partial_person_name']
      country = report.country
      countries[country] ||= 0
      countries[country] += 1
      searches[:total][country] ||= 0
      searches[:total][country] += 1
      searches[:total][:total] += 1
      if query.blank? && !person.blank?
        query = person.to_s
      end
      queries[query] ||= 0
      queries[query] += 1
      searches[query] ||= {:total => 0, :users => []}
      searches[query][:total] += 1
      searches[query][country] ||= 0
      searches[query][country] += 1
      report.facets.each_pair do |facet, values|
        next if facet == 'fulltext'
        facets[facet] ||= 0
        facets[facet] += 1
        searches[query][facet] ||= 0
        searches[query][facet] += 1
        searches[:total][facet] ||= 0
        searches[:total][facet] += 1
      end
      unless report.user_account.nil?
        searches[:total][:users] << report.user_account_id unless searches[:total][:users].include?(report.user_account_id)
        searches[query][:users] << report.user_account_id unless searches[query][:users].include?(report.user_account_id)
      end
    end
    sorted_queries = queries.to_a.sort{|a,b| b.last <=> a.last}.map{|q| q.first}
    sorted_countries = countries.to_a.sort{|a,b| b.last <=> a.last}.map{|c| c.first}
    sorted_facets = facets.to_a.sort{|a,b| b.last <=> a.last}.map{|f| f.first}
    data = []
    row = %w(Suchbegriff Aufrufe Nutzer)
    row += sorted_facets.map{|f| I18n.t(f, :scope => 'activerecord.attributes.interview', :locale => :de)}
    row += sorted_countries.map{|c| UsageReport.country_name(c)}
    data << row
    (['Insgesamt'] + sorted_queries).each do |q|
      row = []
      record = case q
                 when 'Insgesamt'
                   searches[:total]
                 else
                   searches[q]
               end
      row << q
      row << record[:total]
      row << record[:users].size
      sorted_facets.each do |f|
        row << record[f] || 0
      end
      sorted_countries.each do |country|
        row << record[country] || 0
      end
      data << row
    end
    puts "Suchzugriffe im Monat #{date.month} #{date.year}:"
    data.each do |row|
      puts row.map{|i| i.to_s.rjust(8)}.join('|')
    end
    name = "Suchstatistik-#{date.year}-#{date.month.to_s.rjust(2,'0')}.csv"
    puts "Saving to #{name}..."
    UsageReport.save_report_file(name, data)
  end

  def self.create_map_report(date)
    reports = UsageReport.logged_in_month(date).maps.scoped({:include => :user_account})
    requests = {:total => {:total => 0, :anonymous => 0, :users => []}}
    countries = {}
    reports.each do |r|
      country = r.country
      countries[country] ||= 0
      countries[country] += 1
      uid = r.user_account_id
      requests[:total][:total] += 1
      requests[country] ||= {:total => 0, :anonymous => 0, :users => []}
      requests[country][:total] += 1
      if uid.nil?
        requests[country][:anonymous] += 1
        requests[:total][:anonymous] += 1
      else
        requests[country][:users] << uid unless requests[country][:users].include?(uid)
        requests[:total][:users] << uid unless requests[:total][:users].include?(uid)
      end
    end
    data = []
    row = ['Land','Aufrufe','Unangemeldete Aufrufe', 'Angemeldete Nutzer']
    data << row
    row = ['Insgesamt']
    row << requests[:total][:total]
    row << requests[:total][:anonymous]
    row << requests[:total][:users].size
    data << row
    countries.to_a.sort{|a,b| b.last <=> a.last}.map{|c| c.first}.each do |country|
      row = [UsageReport.country_name(country)]
      row << requests[country][:total]
      row << requests[country][:anonymous]
      row << requests[country][:users].size
      data << row
    end
    puts "Karten-Aufrufe im Monat #{date.month} #{date.year}:"
    data.each do |row|
      puts row.map{|i| i.to_s.rjust(8)}.join('|')
    end
    name = "Kartenstatistik-#{date.year}-#{date.month.to_s.rjust(2,'0')}.csv"
    puts "Saving to #{name}..."
    UsageReport.save_report_file(name, data)
  end

  def self.country_name(code)
    return 'Unbekannt' if code.blank?
    I18n.translate(:countries, :locale => :de)[code.to_sym]
  end

  def self.save_report_file(name, data)
    require 'fileutils'
    dir = UsageReport.report_file_path
    FileUtils.mkdir(dir) unless File.directory?(dir)
    filename = File.join(dir, name)
    FileUtils.rm(filename) if File.exist?(filename)
    File.open(filename, 'w') do |file|
      data.each do |rec|
        file << '"' + rec.join("\"\t\"")+"\"\n"
      end
    end
  end

  def self.report_file_path(name=nil)
    File.join([Rails.root, 'assets', 'reports', name].compact)
  end

  protected

  def validate_user_account
    if user_account_id.nil?
      if !login.blank?
        # This happens only on 'SessionController#create' actions,
        # but there is no need to check for that here.
        # NOTE: theoretically, it is possible that someone attempts
        # a login with another accounts login details. Also, this
        # method cannot discern unsuccessful login attempts.
        user_account = UserAccount.find_by_login(login)
        unless user_account.nil?
          self.user_account_id = user_account.id
          UserAccountIp.create({ :user_account_id => user_account.id, :ip => self.ip })
        else
          errors.add(:user_account_id, :missing)
        end
      else
        errors.add(:user_account_id, :missing) unless assign_user_account_by_ip
      end
    end
  end

  def assign_user_account_by_ip
    user_account_ip = UserAccountIp.find_by_ip(self.ip)
    unless user_account_ip.nil?
      self.user_account_id = user_account_ip.user_account_id
      return true
    end
    false
  end

  def validate_archive_id
    unless resource_id.match(Regexp.new("#{CeDiS.config.project_initials}\\d{3}", Regexp::IGNORECASE))
      errors.add(:resource_id, :invalid)
    end
  end

end
