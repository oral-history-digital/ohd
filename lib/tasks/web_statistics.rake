namespace :web_statistics do

  desc "generate usage statistics with indy from the production log"
  task :usage, [:file] => :environment do |task,args|

    require 'fileutils'

    file = args[:file]
    raise "No such file: #{file.inspect}! Please provide a valid log file via the file= argument." unless File.exists?(file)

    last_report = UsageReport.find(:first, :order => "logged_at DESC")
    report_time = (last_report.nil? ? Time.gm(2008) : last_report.logged_at).to_s

    puts "Adding usage_report entries starting from #{report_time}."

    user_ids = {}
    started_adding_records = false

    i = 0
    c = 0
    iv = 0
    invalids = []

    # This is the prefix of the Rails 3.2+ default log format
    r_3_2_prefix = /^[A-Z], \[[-0-9A-Z\s.:#]+\]\s+[A-Z]{4,6}\s+--\s+:\s*/

    # Strategy: look at multi-line patterns
    # opening with a start line (Processing...)
    # potentially containing a parameter line
    # closing with a Completed line

    # it recognizes different tokens/patterns across those lines:
    # timestamp
    r_time = Regexp.new("\s\\d{4}-\\d{2}-\\d{2}\s+\\d{2}:\\d{2}(:\\d{2})?")

    # Start match
    r_start = /^\s*Processing\s+/
    # a HTTP verb
    r_verb = /(GET|PUT|POST|DELETE)/
    # a resource path / url - use the 2nd match term!
    r_path = /(:|"|')\/{1,2}([-\w\d_.]+\/([-\w\d_]+\/)*[-\w\d_\.]+)/
    # path prefixes to remove from absolute urls
    r_path_prefix = /\/?(zwangsarbeit-archiv.de|archiv)/
    # an action token
    r_action = /[\w_]+#[\w_]+/
    # requester IP
    r_ip = /(\d{1,3}\.){3}\d{1,4}/
    # a set of parameters
    r_params = /Parameters: (\{.*\})[^{}]+$/

    File.open(file, 'r') do |log|

      tokens = {}

      log.each_line do |line|

        if (i += 1) % 250000 == 0
          STDOUT.printf '.'
          STDOUT.flush
        end

        # Remove Rails 3.2+ log line prefix
        line.sub(r_3_2_prefix, '')

        if line.match(r_start)
          unless tokens.empty? || tokens[:logged_at].blank?
            # Create an access record (UsageReport instance) for the data tokens
            # Don't instantiate a new object each cycle, but keep an unsaved one in memory
            # UsageReport contains all the logic of what is stores (perhaps through an initializer.yml)

            # if the Record is valid, it is saved.

            # Question: aggregate access to a resource (interview, map etc) or keep individual requests?
            # - requests per day and user (but aggregate within those scopes)
            # - login, interview and pdf's, searches, interactive map

            user_account_id = user_ids[tokens[:ip]]
            if user_account_id.nil? && !tokens[:ip].nil?
              account_ip = UserAccountIP.find_by_ip(tokens[:ip])
              unless account_ip.nil?
                user_account_id = account_ip.user_account_id
                user_ids[tokens[:ip]] = account_ip.user_account_id
              end
            end

            record = UsageReport.new
            record.logged_at = tokens[:logged_at]
            record.action = tokens[:action]
            record.verb = tokens[:verb]
            record.ip = tokens[:ip]
            record.user_account_id = user_account_id unless user_account_id.nil?
            record.parameters = tokens[:parameters]

            if record.valid?
              record.save
              c+=1
            elsif UsageReport::TRACKED_ACTIONS.include?(record.action)
              invalids << "Record INVALID from: #{tokens.inspect}\nRecord: #{record.inspect}"
              iv += 1
            end
          end
          tokens = {}
          # try to match new entry tokens
          time_token = line.match(r_time)

          # skip entries until the report time was reached
          next if time_token[0].strip < report_time

          if !started_adding_records
            puts "Starting to add records [from #{time_token[0]}]:"
            started_adding_records = true
          end

          verb_token = line.match(r_verb)
          ip_token = line.match(r_ip)
          if time_token && verb_token && ip_token
            tokens = {
                :logged_at => time_token[0].strip,
                :verb => verb_token[0].strip,
                :ip => ip_token[0].strip
            }
          end
        end

        # these entries can be assigned on the first or subsequent lines
        unless tokens.empty? || tokens[:logged_at].blank?
          # try to match parameters, action or path
          parameter_token = line.match(r_params)
          tokens[:parameters] = eval(parameter_token[1]) unless parameter_token.blank?
          path_token = line.match(r_path)
          tokens[:path] = path_token[2].gsub(r_path_prefix,'').strip if tokens[:path].blank? && !path_token.blank?
          action_token = line.match(r_action)
          tokens[:action] = action_token[0].strip if tokens[:action].blank? && !action_token.blank?
        end

      end

    end

    invalids.each do |report|
      puts report
    end

    puts "Done parsing since #{report_time}.\n#{i} lines parsed, #{c} usage records created. #{iv} invalid usage reports for tracked actions."
  end


  desc "Prints a table of last logins since 2011"
  task :last_logins => :environment do

    require 'fileutils'

    month_num = Time.now.month - 1 + (Time.now.year - 2011) * 12

    csv_file = "zwar-logins-nach-monat.csv"
    if File.exists?(csv_file)
      FileUtils.rm(csv_file)
    end
    fields = ['Jahr','Monat','Nutzer mit letztem Login in diesem Monat']
    system "echo '#{fields.join("\t")}' >> #{csv_file}"

    (1..month_num).each do |month|
      time = Time.gm(2011,1,1) + month.months
      count = UserAccount.count(:conditions => ["last_sign_in_at < ?", time.to_s(:db)])
      csv = [ (time - 1.month).year, (time - 1.month).month, count ]
      system "echo '#{csv.join("\t")}' >> #{csv_file}"
    end

    puts "Done. Written stats for #{month_num} months since 31.12.2010 to #{csv_file}."

  end


  desc "Usage by number of total logins"
  task :total_logins => :environment do

    require 'fileutils'

    csv_file = "zwar-logins-gesamt.csv"
    if File.exists?(csv_file)
      FileUtils.rm(csv_file)
    end
    system "touch #{csv_file}"

    fields = [ 'Anzahl an Logins (seit 07/2010)', 'Anzahl an Nutzern' ]

    system "echo '#{fields.join("\t")}' >> #{csv_file}"

    values = (1..9).to_a

    values.each do |val|
      num = UserAccount.count :conditions => ['sign_in_count = ?', val]
      csv = [val, num]
      system "echo '#{csv.join("\t")}' >> #{csv_file}"
    end

    num = UserAccount.count :conditions => ['sign_in_count > 9']

    csv = ['10+', num]
    system "echo '#{csv.join("\t")}' >> #{csv_file}"

    puts "Written usage statistics by total logins to #{csv_file}"

  end


end
