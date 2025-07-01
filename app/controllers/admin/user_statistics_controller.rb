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
            (
              params[:countries].try(:join, '-') ||
              TranslationValue.for('user_statistics.total', locale)
            )
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

    archive_categories = ['job_description', 'user_projects.research_intentions', 'country', 'default_locale']
    ohd_categories = ['country', 'default_locale']
    date_attribute = current_project.is_ohd? ? 'users.confirmed_at' : 'user_projects.activated_at'

    time_slots = (
      total(date_attribute, locale) +
      years(live_since, date_attribute) +
      months(live_since, date_attribute)
    ).to_h

    CSV.generate(**CSV_OPTIONS) do |csv|
      csv << [
        TranslationValue.for('user_statistics.header', locale, date: Time.now.strftime('%d.%m.%Y')),
      ] + time_slots.keys

      csv << [
        nil,
      ] + time_slots.map{|k, conditions| users.where(conditions).count }

      (current_project.is_ohd? ? ohd_categories : archive_categories).each do |category|
        category_key = category.split('.').last
        csv << ["'=== #{TranslationValue.for("activerecord.attributes.user.#{category_key}", locale)} ==='"]
        users.
          group(category).count.
          sort_by{ |group| -group.last }.
          each do |entry, count|
            csv << [
              label_for(category_key, entry, locale),
            ] + time_slots.map{|k, conditions| users.where(conditions).where(category => entry).count }
        end
      end

      # restricted interviews
      date_attribute = 'interview_permissions.created_at'
      time_slots = (
        total(date_attribute, locale) +
        years(live_since, date_attribute) +
        months(live_since, date_attribute)
      ).to_h

      csv << []
      csv << [
        "'=== #{TranslationValue.for("modules.tables.interviewPermissions", locale)} ==='"
      ] + time_slots.map do |k, conditions|
        users.
          joins(:interview_permissions).
          where(conditions).
          where("interview_permissions.interview_id": current_project.interviews.pluck(:id)).
          count
      end

      # add a row for each archive
      if current_project.is_ohd?
        date_attribute = 'user_projects.activated_at'

        time_slots = (
          total(date_attribute, locale) +
          years(live_since, date_attribute) +
          months(live_since, date_attribute)
        ).to_h

        csv << ["'=== #{TranslationValue.for("activerecord.models.project.one", locale)} ==='"]
        Project.where.not(shortname: 'ohd').
          left_joins(:user_projects).
          where.not(user_projects: {activated_at: nil}).
          group(:id).
          order('COUNT(user_projects.id) DESC').
          each do |project|
            csv << [
              project.shortname,
            ] + time_slots.map do |k, conditions|
              users.
                joins(:user_projects).
                where(conditions).
                where("user_projects.project_id = ?", project.id).
                count
            end
        end
      end
    end
  end

  def label_for(category, entry, locale)
    category_title = TranslationValue.for("activerecord.attributes.user.#{category}", locale)
    not_specified = TranslationValue.for('user_statistics.not_specified', locale)
    if entry.blank?
      "#{not_specified} (#{category_title})"
    elsif category == 'country'
      TranslationValue.for("countries.#{entry}", locale)
    elsif entry == 'other'
      TranslationValue.for("user_project.#{category}.#{entry}", locale) + " (#{category_title})"
    else
      TranslationValue.for("user_project.#{category}.#{entry}", locale, {}, true)
    end
  end

  def total(date_attribute, locale = I18n.locale)
    [[
      TranslationValue.for('user_statistics.total', locale),
      [
        "#{date_attribute} <= ?",
        Time.now
      ]
    ]]
  end

  def years(live_since, date_attribute)
    ((live_since.year + 1)..Time.now.year).inject([]) do |mem, y|
      mem << [
        y,
        [
          "#{date_attribute} > ? AND #{date_attribute} <= ?",
          Date.parse("31.12.#{y - 1}"),
          Date.parse("31.12.#{y}")
        ]
      ]
      mem
    end
  end
    
  def months(live_since, date_attribute)
    days_live = (Date.today - live_since.to_date).to_i
    max_months = days_live > 365 ? 11 : (days_live / 30).ceil
    (0..max_months).to_a.reverse.inject([]) do |mem, m|
      mem << [
        (Time.now - m.months).strftime('%m.%Y'),
        [
          "#{date_attribute} > ? AND #{date_attribute} <= ?",
          (Time.now - (m + 1).months).end_of_month.to_date,
          (Time.now - m.months).end_of_month.to_date
        ]
      ]
      mem
    end
  end

end
