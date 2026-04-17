class Admin::InterviewStatisticsController < Admin::BaseController
  def index
    policy_scope(User)

    respond_to do |wants|
      wants.html { head :ok }
      wants.csv do
        authorize User, :show?

        send_data(
          InterviewStatisticsExporter.perform(project: current_project, locale: locale),
          filename: [
            Time.current.strftime('%Y-%m-%d-%H%M'),
            current_project.shortname,
            TranslationValue.for('interview_statistics.report_title', locale, {}, true)
          ].join('-') + '.csv'
        )
      end
    end
  end
end
