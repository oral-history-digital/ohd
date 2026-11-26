# frozen_string_literal: true

# Reads speaker designations without validating timing or changing interview data.
class ImportSpeakerLabels
  # @param options [Hash] Authorized interview, temporary upload path, and header locale
  # @param edit_table [Boolean] Whether to use the edit-table CSV headers and reader
  def initialize(options, edit_table: false)
    @options = options
    @edit_table = edit_table
  end

  # Extracts unique, nonblank labels while preserving the values used by the importer.
  # @return [Array<String>] Speaker labels, or no labels for unstructured formats
  # @raise [Roo::HeaderRowNotFoundError, CSV::MalformedCSVError] If the table cannot be read
  def call
    path = @options.fetch(:file_path).to_s
    labels = if @edit_table
               EditTableImport.new(@options[:interview], path, @options[:locale]).sheet.pluck(:speaker_designation)
             elsif TranscriptSpreadsheetImport::EXTENSIONS.include?(File.extname(path).delete_prefix('.'))
               workbook = Roo::Spreadsheet.open(path, csv_options: CSV_OPTIONS)
               workbook.sheets.flat_map do |name|
                 workbook.sheet(name).parse(speaker: TranscriptSpreadsheetImport::HEADERS.fetch(:speaker)).pluck(:speaker)
               end
             elsif File.extname(path) == '.vtt'
               TranscriptSubtitleReader.new(path).speaker_designations
             else
               []
             end
    labels.compact.map(&:to_s).reject(&:blank?).uniq
  end
end
