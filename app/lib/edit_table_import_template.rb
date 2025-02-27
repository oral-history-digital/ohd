class EditTableImportTemplate

  def initialize(interview, locale)
    @csv = CSV.generate(**CSV_OPTIONS.merge(headers: true)) do |f|
      f << interview.edit_table_headers(locale).values
    end
  end

  def csv
    @csv
  end

end
