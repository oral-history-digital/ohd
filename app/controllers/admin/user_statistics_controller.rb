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
      wants.csv do
        send_data(
          generate_csv,
          filename: [
            Time.now.strftime("%Y-%m-%d-%H%M"),
            current_project.shortname,
            TranslationValue.for('user_statistics.user_statistic', locale),
            params[:countries].try(:join, '-')
          ].join('-') + '.csv'
        )
      end
    end
  end

  def usage_report
    filename = params['filename']
    response.headers['Cache-Control'] = 'no-store'
    @file = File.join(UsageReport.report_file_path, filename)
    send_file @file, :disposition => 'inline', :type => 'text/csv'
  end

  private

  def generate_csv(locale = I18n.locale)
    live_since = current_project.live_since || current_project.created_at

    users = current_project.is_ohd? ? User.where.not(confirmed_at: nil) : current_project.users
    users = users.where(country: params[:countries]) if params[:countries].present?

    categories = ['job_description', 'research_intentions', 'country', 'default_locale']
    date_attribute = current_project.is_ohd? ? 'users.confirmed_at' : 'user_projects.activated_at'

    time_slots = (
      total(live_since, date_attribute, locale) +
      years(live_since, date_attribute) +
      months(date_attribute)
    ).to_h

    CSV.generate(:col_sep => "\t", quote_char: "\x00") do |csv|
      csv << [
        TranslationValue.for('user_statistics.header', locale, date: Time.now.strftime('%d.%m.%Y')),
      ] + time_slots.keys

      csv << [
        nil,
      ] + time_slots.map{|k, conditions| users.where(conditions).count }

      categories.each do |category|
        csv << ["'=== #{TranslationValue.for("activerecord.attributes.user.#{category}", locale)} ==='"]
        users.
          group(category).count.
          sort_by{ |group| -group.last }.
          each do |entry, count|
            csv << [
              label_for(category, entry, locale),
            ] + time_slots.map{|k, conditions| users.where(conditions).where(category => entry).count }
        end
      end
    end
  end

  def label_for(category, entry, locale)
    category_title = TranslationValue.for("activerecord.attributes.user.#{category}", locale)
    if entry.blank?
      "k. A. (#{category_title})"
    elsif category == 'country'
      TranslationValue.for("countries.#{entry}", locale)
    elsif entry == 'other'
      TranslationValue.for("user_project.#{category}.#{entry}", locale) + " (#{category_title})"
    else
      TranslationValue.for("user_project.#{category}.#{entry}", locale, {}, true)
    end
  end

  def total(live_since, date_attribute, locale = I18n.locale)
    [[
      TranslationValue.for('user_statistics.total', locale),
      [
        "#{date_attribute} >= ? AND #{date_attribute} < ?",
        live_since,
        Time.now
      ]
    ]]
  end

  def years(live_since, date_attribute)
    (live_since.year..Time.now.year).inject([]) do |mem, y|
      mem << [
        y,
        [
          "#{date_attribute} >= ? AND #{date_attribute} < ?",
          Date.parse("1.1.#{y}"),
          Date.parse("31.12.#{y}")
        ]
      ]
      mem
    end
  end
    
  def months(date_attribute)
    (0..11).to_a.reverse.inject([]) do |mem, m|
      mem << [
        (Time.now - m.months).strftime('%m.%Y'),
        [
          "#{date_attribute} >= ? AND #{date_attribute} < ?",
          (Time.now - m.months).beginning_of_month,
          (Time.now - m.months).end_of_month
        ]
      ]
      mem
    end
  end

end
