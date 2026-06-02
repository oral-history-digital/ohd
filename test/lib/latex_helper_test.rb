require 'test_helper'

class LatexHelperTest < ActiveSupport::TestCase
  include LatexHelper
  
  test 'interview_date_for_pdf keeps multiple valid dates' do
    value = '03.07.2019,12.07.2019'

    assert_equal '03.07.2019, 12.07.2019', interview_date_for_pdf(value)
  end

  test 'interview_date_for_pdf falls back to full string for mixed invalid input' do
    value = '03.sdfd07.2019,12.07.2019sdfdsfds'

    assert_equal value, interview_date_for_pdf(value)
  end

  test 'interview_date_for_pdf converts iso date to dd.mm.yyyy' do
    assert_equal '13.05.2023', interview_date_for_pdf('2023-05-13')
  end

  test 'interview_date_for_pdf keeps free-form year range untouched' do
    assert_equal '1979-1981', interview_date_for_pdf('1979-1981')
  end

  test 'interview_date_for_pdf keeps free-form text untouched' do
    assert_equal 'sometime in 2020', interview_date_for_pdf('sometime in 2020')
  end

  test 'interview_date_for_pdf correctly handles multiple dates with different separators' do
    value = '03.07.2019; 12.07.2019/15.08.2019'

    assert_equal '03.07.2019, 12.07.2019, 15.08.2019', interview_date_for_pdf(value)
  end

  test 'interview_date_for_pdf correctly uses output separator' do
    value = '03.07.2019; 12.07.2019/15.08.2019'

    assert_equal '03.07.2019 / 12.07.2019 / 15.08.2019', interview_date_for_pdf(value, separator: ' / ')
  end

  test 'interview_metadata_label_for_pdf uses project metadata label when present' do
    project = DataHelper.project_with_contribution_types_and_metadata_fields
    metadata_field = MetadataField.create!(
      project: project,
      source: 'Interview',
      name: 'interview_date',
      label: 'Interview date'
    )
    metadata_field.update!(label: 'Project Interview Date Label', locale: :en)

    interview = DataHelper.interview_with_everything(project)

    assert_equal 'Project Interview Date Label', interview_metadata_label_for_pdf(interview, :interview_date, :en)
  end

  test 'interview_metadata_label_for_pdf falls back to activerecord translation key' do
    project = DataHelper.project_with_contribution_types_and_metadata_fields
    interview = DataHelper.interview_with_everything(project)
    metadata_field = MetadataField.create!(
      project: project,
      source: 'Interview',
      name: 'interview_date',
      label: 'Interview date'
    )
    metadata_field.update!(label: nil, locale: :en)

    expected = TranslationValue.for('activerecord.attributes.interview.interview_date', :en)

    assert_equal expected, interview_metadata_label_for_pdf(interview, :interview_date, :en)
  end
end
