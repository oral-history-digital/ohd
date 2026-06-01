class Admin::InterviewStatisticsController < Admin::BaseController
  def index
    # Intentionally call policy_scope for index to satisfy Pundit's scope verification.
    policy_scope(User)

    respond_to do |wants|
      wants.html { head :ok }
      wants.csv do
        authorize User, :show?

        report_title = TranslationValue.for('interview_statistics.report_title', I18n.locale, {}, true)

        send_data(
          InterviewStatisticsExporter.perform(project: current_project, locale: I18n.locale),
          filename: [
            Time.current.strftime('%Y-%m-%d-%H%M'),
            current_project.shortname,
            safe_filename_part(report_title)
          ].join('-') + '.csv'
        )
      end
    end
  end

  private

  def safe_filename_part(value)
    sanitized = value.to_s
      .gsub(/[^\p{Alnum}._-]+/, '_') # Replace sequences of unsafe characters with a single underscore.
      .gsub(/_+/, '_') # Replace multiple underscores with a single underscore.
      .gsub(/\A_|_\z/, '') # Remove leading or trailing underscores.

    sanitized.presence || 'report'
  end
end
