class Admin::UserStatisticsController < Admin::BaseController

  require 'csv'

  def index
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

    mapping_file = File.join(Rails.root, 'config', 'statistics_mappings.yml')
    mappings = YAML::load_file(mapping_file)

    @list = [ :header, :count ]
    @rows = {
            :header => { :label => "Benutzerstatistik vom #{Time.now.strftime("%d.%m.%Y")}", :sum => "Gesamt-Zeitraum", :cols => {} },
            :count => { :label => nil, :sum => User.count, :cols => {} }
    }
    @errors = []

    categories = { 'Beruf' => 'job_description', 'Recherche-Anliegen' => 'research_intentions', 'Land' => 'country' }
    categories.each do |category, field_name|
      list = [ category.to_s ]
      category_results = User.count(:group => field_name).sort_by { |group| -group.last }
      category_results.each do |category_result|
        label = category_result.first
        label = "k. A. (#{category})" if label.empty?
        if mappings.keys.include?(field_name)
          category_mappings = mappings[field_name]
          if category_mappings.keys.include?(label)
            label = category_mappings[label]
          end
        end
        sum = category_result.last
        row_title = category == 'Land' ? I18n.t(label, :scope => :countries, :locale => :de) : label
        if @rows.include?(label)
          @rows[label][:sum] += sum
        else
          @list << label
          @rows[label] = { :label => row_title, :sum => sum, :cols => {} }
        end
      end
      #inserts an empty row
      @list << [ nil ]
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
        results = User.count(:group => field_name, :conditions => conditions)
        results.each do |label, value|
          label = "k. A. (#{category})" if label.empty?

          if mappings.keys.include?(field_name)
            category_mappings = mappings[field_name]
            if category_mappings.keys.include?(label)
              label = category_mappings[label]
            end
          end

          if @rows[label]
            unless @rows[label][:cols][month_label] == nil
              @rows[label][:cols][month_label] = @rows[label][:cols][month_label] + value
            else
              @rows[label][:cols][month_label] = value
            end
          else
            @errors << "#{label} mit Wert '#{value}' nicht berücksichtigt."
          end
        end
      end
    end

    render_csv("#{Time.now.strftime("%Y-%m-%d-%H%M")}-ZWAR-Benutzerstatistik")
  end

end
