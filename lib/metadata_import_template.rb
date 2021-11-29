class MetadataImportTemplate

  def initialize(project)
    @csv = CSV.generate(headers: true, col_sep: ";", row_sep: :auto, quote_char: "\x00") do |csv|
      csv << ['Interview-Id'] + project.import_metadata_fields.map{|field| field.name}
    end
  end

  def csv
    @csv
  end

end
