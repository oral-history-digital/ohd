# frozen_string_literal: true

# Imports an uploaded edit table and delegates completion or error emails to ApplicationJob.
class ReadEditTableJob < ApplicationJob
  queue_as :default

  # Imports the edit table atomically and removes the uniquely named upload afterward.
  #
  # @param opts [Hash] Interview, upload path, locale, reference mode, and contributions
  # @return [void]
  def perform(opts)
    EditTableImport.new(
      opts[:interview],
      opts[:file_path],
      opts[:locale],
      ActiveModel::Type::Boolean.new.cast(opts[:only_references]),
      contributions_attributes: opts[:contributions_attributes]
    ).process
  ensure
    FileUtils.rm_f(opts[:file_path]) if opts[:filename]
  end
end
