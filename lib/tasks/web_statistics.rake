namespace :web_statistics do

  desc "generate usage statistics with indy from the production log"
  task :usage, [:month, :year, :file] => :environment do |task,args|

    require 'fileutils'

    month = args[:month]
    year = args[:year] || Time.now.year

    file = args[:file]

    bot_ips = []
    bots = []

    user_ids = {}
    unknown_ips = []
    visiting_ips = []
    sign_ins = {}

    raise "Please provide a month and year argument for log parsing!" if month.blank? || !(1..12).to_a.include?(month.to_i)

    raise "No such file: #{file.inspect}! Please provide a valid log file via the file= argument." unless File.exists?(file)

    monthnames = %w(Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec)

    dater = '\[(\d{2}/' + monthnames[month.to_i-1] + '/' + year.to_s + '[^\]]+)]'
    r = Regexp.new('^(\d{1,4}\.\d{1,4}\.\d{1,4}\.\d{1,4})\s*-[^-]+-\s*' + dater + '\s*"(GET|POST)\s+([^\s]+)\s+HTTP/1.1"\s*(\d+)\s*\d+\s*"([^"]+)"\s+"([^"]+)"')

    fields = [:user_id, :ip, :time, :method, :request, :status, :referer, :user_agent]

    csv_file = "zwar-log-#{year}-#{month}.csv"
    if File.exists?(csv_file)
      FileUtils.rm(csv_file)
    end
    system "touch #{csv_file}"
    csv_header = fields.map{|f| f.to_s.capitalize }.join("\t")
    system "echo '#{csv_header}' >> #{csv_file}"

    i = 0
    c = 0

    File.open(file, 'r') do |log|

      log.each_line do |line|

        if (i += 1) % 2000 == 0
          STDOUT.printf '.'
          STDOUT.flush
        end

        record = line.match(r)
        unless record.blank?
          results = {}
          fields[1..10].each_with_index do |field, index|
            item = record[index+1]
            results[field] = item
          end

          # ignore Bots
          next if bot_ips.include?(results[:ip])
          if results[:request] == '/robots.txt'
            # add to bots
            bot_ips << results[:ip]
            bots << results[:user_agent] unless bots.include?(results[:user_agent])
            next
          end

          # check if the request path is interesting
          if results[:method] == 'POST'
            # skip person searches - they don't include parameters on POST
            next if results[:request] == '/archiv/suche/person_name'
            next if results[:request] == '/archiv/searches/person_name'

            # store sign_ins
            if results[:request] == '/archiv/user_accounts/sign_in'
              sign_ins[results[:ip]] ||= {:times => 0, :last => ''}
              hour = results[:time][/\d{2}\/\w{3}\/\d{4}:\d{2}/]
              if hour != sign_ins[results[:ip]][:last]
                sign_ins[results[:ip]][:times] = sign_ins[results[:ip]][:times] + 1
                sign_ins[results[:ip]][:last] = hour
              end
            end
          else
            # don't track requests for specific files
            next if results[:request].index('.') != nil
          end

          # add to visiting ips
          visiting_ips << results[:ip] unless visiting_ips.include?(results[:ip])

          # check user_id
          user_id = user_ids[results[:ip]]
          unless unknown_ips.include?(results[:ip])
            if user_id.nil?
              user_id ||= UserAccountIP.find_by_ip(results[:ip])
              unless user_id.nil?
                user_id = user_id.user_account_id
                user_ids[results[:ip]] = user_id
              else
                unknown_ips << results[:ip]
              end
            end
          end
          results[:user_id] = user_id || 'unbekannt'

          # add results to csv
          csv_line = fields.map{|f| results[f] }.join("\t")
          system "echo '#{csv_line}' >> #{csv_file}"

          c += 1

        end

      end

    end

    csv_file = "zwar-sign-ins-#{year}-#{month}.csv"
    if File.exists?(csv_file)
      FileUtils.rm(csv_file)
    end
    system "touch #{csv_file}"
    sign_in_fields = [:ip, :sign_ins, :last]
    system "echo '#{sign_in_fields.map{|f| f.to_s }.join("\t")}' >> #{csv_file}"

    sign_ins.keys.each do |ip|
      csv = [ ip ]
      csv << sign_ins[ip][:times]
      csv << sign_ins[ip][:last]
      system "echo '#{csv.join("\t")}' >> #{csv_file}"
    end

    puts "\nDone! #{i} lines of log parsed, #{c} lines written to csv table.\n#{visiting_ips.size} distinct archive_users, #{sign_ins.keys.size} sign ins, #{user_ids.values.uniq.size} known visiting users and #{bots.size} bots found."

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
