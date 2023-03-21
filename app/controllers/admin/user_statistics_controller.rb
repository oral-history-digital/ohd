class Admin::UserStatisticsController < Admin::BaseController

  require 'csv'

  def index
    policy_scope(UserAccount)
    @usage_reports = Dir.glob(File.join(UsageReport.report_file_path, '*.csv')).map{|f| f.split('/').last}
    @tiered_reports = {}
    @usage_reports.each do |r|
      year = r[/\d{4}/]
      @tiered_reports[year] ||= []
      @tiered_reports[year] << r
    end
    respond_to do |wants|
      wants.html
      wants.csv { csv_export }
    end
  end

  def usage_report
    filename = params['filename']
    response.headers['Cache-Control'] = 'no-store'
    @file = File.join(UsageReport.report_file_path, filename)
    send_file @file, :disposition => 'inline', :type => 'text/csv'
  end

  private

  def csv_export
    countries = params[:countries] || UserAccount.where.not(country: '').map{|u|u.country}.compact.uniq.sort

    @list = [ :header, :count ]
    @rows = {
            :header => { :label => "Benutzerstatistik vom #{Time.now.strftime("%d.%m.%Y")}", :sum => "Gesamt-Zeitraum", :cols => {} },
            :count => { :label => nil, :sum => UserAccount.where(country: countries).count, :cols => {} }
    }
    @errors = []

    categories = { 'Beruf' => 'job_description', 'Recherche-Anliegen' => 'research_intentions', 'Land' => 'country' }
    categories.each do |category, field_name|
      #inserts title row
      @list << "'=== #{category} ==='"
      #
      category_results = UserAccount.where(country: countries).group(field_name).count.sort_by { |group| -group.last }

      category_results.each do |entry, count|
        if category == 'Land'
          label = I18n.t(entry, :scope => :countries, :locale => :de)
        elsif entry.blank?
          label = "k. A. (#{category})"
        elsif entry == 'other'
          label = I18n.t("user.#{field_name}.#{entry}", :locale => :de) + " (#{category})"
        else
          label = I18n.t("user.#{field_name}.#{entry}", :locale => :de)
        end
        if @rows.include?(label)
          @rows[label][:sum] += count
        else
          @list << label
          @rows[label] = { :label => label, :sum => count, :cols => {} }
        end
      end
    end

    date_pattern = "%m / %Y"
    first_month = Date.new(2010, 7)
    current_month = first_month
    last_month = (Date.today-1.month).beginning_of_month

    months = [ nil ]
    while current_month <= last_month
      months << current_month
      current_month += 1.month
    end
    months << [ nil ]

    @month_labels = []
    months.each_with_index do |month, index|
      if index === 0
        month_label = "Vor #{first_month.strftime(date_pattern)}"
        conditions = ["created_at < ?", first_month]
      elsif index === (months.size-1)
        month_label = "#{last_month.next_month.strftime(date_pattern)} (bis #{Time.now.strftime("%d.%m.")})"
        conditions = ["created_at >= ?", last_month.next_month]
      else
        month_label = month.strftime(date_pattern)
        conditions = ["created_at >= ? AND created_at < ?", month, month.next_month]
      end
      @month_labels << month_label
      @rows[:header][:cols][month_label] = month_label

      categories.each do |category, field_name|
        results = UserAccount.where(country: countries).where(conditions).group(field_name).count
        results.each do |entry, count|
          if category == 'Land'
            label = I18n.t(entry, :scope => :countries, :locale => :de)
          elsif entry.blank?
            label = "k. A. (#{category})"
          elsif entry == 'other'
            label = I18n.t("user.#{field_name}.#{entry}", :locale => :de) + " (#{category})"
          else
            label = I18n.t("user.#{field_name}.#{entry}", :locale => :de)
          end

          if @rows[label]
            unless @rows[label][:cols][month_label] == nil
              @rows[label][:cols][month_label] = @rows[label][:cols][month_label] + count
            else
              @rows[label][:cols][month_label] = count
            end
          else
            @errors << "#{label} mit Wert '#{count}' nicht berücksichtigt."
          end
        end
      end
    end

    content = CSV.generate(:col_sep => "\t", quote_char: "\x00") do |csv|
      @list.each do |col|
        row = @rows[col]
        if row === nil
          csv << [ col ]
        else
          cells_for_row = [ row[:label], row[:sum] ]
          @month_labels.each do |month_label|
            cells_for_row << row[:cols][month_label]
          end
          csv << cells_for_row
        end
      end
      csv << []
      csv << [ "Stand der Erhebung: #{Time.now.strftime("%d.%m.%Y %H:%M")}" ]
      csv << [ "Zeitraum: Gesamt" ]
      csv << [ @errors.size == 0 ? 'Keine Fehlermeldungen.' : 'Fehler / Warnungen:' ]
      @errors.each do |error|
        csv << [ error ]
      end
    end

    send_data(content, filename: "#{Time.now.strftime("%Y-%m-%d-%H%M")}-#{current_project.shortname}-Benutzerstatistik-#{params[:countries].try(:join, '-') || "gesamt"}.csv")
  end

end
