class Admin::UserStatisticsController < Admin::BaseController

  require 'csv'

  def index
    respond_to do |wants|
      wants.html
      wants.csv { csv_export }
    end
  end
  
  private

  def csv_export
    #@first_registration = UserRegistration.find(:first, :conditions => ['created_at <> ?', 0], :order => 'created_at ASC')
    #@last_registration = UserRegistration.find(:first, :conditions => ['created_at <> ?', 0], :order => 'created_at DESC')
    #@user_registrations = UserRegistration.find(:all, :order => 'created_at ASC')

    @list = [ :header ]
    @rows = {
            :header => { :label => "ZWAR-Benutzerstatisik vom #{}", :sum => User.count, :cols => {} }
    }

    categories = { 'Beruf' => 'job_description', 'Recherche-Anliegen' => 'research_intentions', 'Land' => 'country' }
    categories.each do |category, field_name|
      list = [ category.to_s ]
      category_results = User.count(:group => field_name).sort_by { |group| -group.last }
      category_results.each do |category_result|
        label = category_result.first
        label = "k. A. (#{category})" if label.empty?
        sum = category_result.last
        @list << label
        @rows[label] = { :label => label, :sum => sum, :cols => {} }
      end
      #inserts an empty row
      @list << [ nil ]
    end

    date_pattern = "%m / %Y"
    first_month = Date.new(2010, 7)
    current_month = first_month
    last_month = Date.new(2011, 2)

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
          @rows[label][:cols][month_label] = value if @rows[label]
        end
      end
    end

    render_csv("#{Time.now.strftime("%Y-%m-%d-%H%M")}-ZWAR-Benutzerstatistik")
  end

end