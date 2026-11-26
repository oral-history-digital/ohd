require 'test_helper'
require 'minitest/mock'

class EditTablesControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  test 'queues the original filename and defers contribution updates' do
    project = Project.find_by!(shortname: 'test')
    interview = project.interviews.first
    contribution = interview.contributions.first
    original = contribution.speaker_designation
    sign_in User.find_by!(email: 'alice@example.com')
    queued = nil
    @controller.stub(:current_project, project) do
      ReadEditTableJob.stub(:perform_later, ->(options) { queued = options }) do
        post :create, params: {
          format: :json, locale: 'en',
          edit_table: {
            archive_id: interview.archive_id,
            data: fixture_file_upload(Rails.root.join('test/files/transcript_de.csv'), 'text/csv'),
            contributions_attributes: { '0' => { id: contribution.id, speaker_designation: 'CHANGED' } }
          }
        }
      end
    end
    assert_response :ok
    assert_equal original, contribution.reload.speaker_designation
    assert_equal 'transcript_de.csv', queued.fetch(:filename)
  ensure
    FileUtils.rm_f(queued[:file_path]) if queued
  end

  test 'rejects an interview from another project before queuing' do
    project = Project.find_by!(shortname: 'test')
    other = Project.find_by!(shortname: 'ohd')
    sign_in User.find_by!(email: 'alice@example.com')
    @controller.stub(:current_project, other) do
      assert_raises(ActiveRecord::RecordNotFound) do
        post :create, params: {
          format: :json, locale: 'en', edit_table: { archive_id: project.interviews.first.archive_id }
        }
      end
    end
  end
end
