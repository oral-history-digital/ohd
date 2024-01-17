class Admin::UserStatisticsController < Admin::BaseController

  require 'csv'

  def index
    policy_scope(User)
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

  def csv_export(locale = I18n.locale)
    live_since = current_project.live_since || current_project.created_at
    countries = params[:countries] ||
      current_project.users.where.not(country: ['', nil]).map{|u|u.country}.compact.uniq.sort

    @list = [ :header, :count ]
    @rows = {
      header: {
        row_label: TranslationValue.for('user_statistics.header', locale, date: Time.now.strftime('%d.%m.%Y')),
        sum: TranslationValue.for('user_statistics.total_period', locale),
        cols: {}
      },
      count: {
        row_label: nil,
        sum: current_project.users.where(country: countries).count,
        cols: {}
      }
    }
    @errors = []

    categories = ['job_description', 'research_intentions', 'country']
    categories.each do |category|
      #inserts title row
      category_title = TranslationValue.for("activerecord.attributes.user.#{category}", locale)
      @list << "'=== #{category_title} ==='"
      #
      current_project.users.
        where(country: countries).
        group(category).count.
        sort_by{ |group| -group.last }.
        each do |entry, count|
          row_label = label_for(category, entry, locale)
          if @rows.include?(row_label)
            @rows[row_label][:sum] += count
          else
            @list << row_label
            @rows[row_label] = { row_label: row_label, sum: count, cols: {} }
          end
        end
    end

    table_name = current_project.is_ohd? ? 'users' : 'user_projects'
    time_slots = years(live_since, table_name) + months(table_name)

    time_slots.each do |time_slot|
      slot_label, conditions = time_slot
      @rows[:header][:cols][slot_label] = slot_label

      categories.each do |category|
        current_project.users.
          where(country: countries).
          where(conditions).
          group(category).count.
          sort_by{ |group| -group.last }.
          each do |entry, count|
            row_label = label_for(category, entry, locale)

            if @rows[row_label]
              unless @rows[row_label][:cols][slot_label] == nil
                @rows[row_label][:cols][slot_label] = @rows[row_label][:cols][slot_label] + count
              else
                @rows[row_label][:cols][slot_label] = count
              end
            else
              @errors << TranslationValue.for("user_statistics.not_considered", locale, row_label: row_label, count: count)
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
          cells_for_row = [ row[:row_label], row[:sum] ]
          time_slots.to_h.keys.each do |slot_label|
            cells_for_row << row[:cols][slot_label]
          end
          csv << cells_for_row
        end
      end
      csv << []
      csv << [TranslationValue.for('user_statistics.status_date', locale, date: Time.now.strftime("%d.%m.%Y %H:%M"))]
      csv << [TranslationValue.for('user_statistics.total_period', locale)]
      csv << [ 
        @errors.size == 0 ?
        TranslationValue.for('user_statistics.no_errors', locale) :
        TranslationValue.for('user_statistics.errors', locale)
      ]
      @errors.each do |error|
        csv << [ error ]
      end
    end

    send_data(
      content,
      filename: [
        Time.now.strftime("%Y-%m-%d-%H%M"),
        current_project.shortname,
        TranslationValue.for('user_statistics.user_statistic', locale),
        (
          params[:countries].try(:join, '-') ||
          TranslationValue.for('user_statistics.total', locale)
        )
      ].join('-') + '.csv'
    )
  end

  def label_for(category, entry, locale)
    category_title = TranslationValue.for("activerecord.attributes.user.#{category}", locale)
    if category == 'country'
      TranslationValue.for("countries.#{entry}", locale)
    elsif entry.blank?
      "k. A. (#{category_title})"
    elsif entry == 'other'
      TranslationValue.for("user_project.#{category}.#{entry}", locale) + " (#{category_title})"
    else
      TranslationValue.for("user_project.#{category}.#{entry}", locale)
    end
  end

  def years(live_since, table_name)
    (live_since.year..Time.now.year).inject([]) do |mem, y|
      mem << [
        y,
        [
          "#{table_name}.created_at >= ? AND #{table_name}.created_at < ?",
          Date.parse("1.1.#{y}"),
          Date.parse("31.12.#{y}")
        ]
      ]
      mem
    end
  end
    
  def months(table_name)
    (0..11).to_a.reverse.inject([]) do |mem, m|
      mem << [
        (Time.now - m.months).strftime('%m.%Y'),
        [
          "#{table_name}.created_at >= ? AND #{table_name}.created_at < ?",
          (Time.now - m.months).beginning_of_month,
          (Time.now - m.months).end_of_month
        ]
      ]
      mem
    end
  end

end
