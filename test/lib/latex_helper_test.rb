require 'test_helper'
require 'ostruct'

class LatexHelperTest < ActiveSupport::TestCase
  include LatexHelper

  def build_project(name: 'World Magic')
    project = OpenStruct.new(
      shortname: 'wm',
      domain_with_optional_identifier: 'http://portal.oral-history.localhost:3000'
    )
    project.define_singleton_method(:name) { |_locale| name }
    project
  end

  def build_interview(doi_status: nil, used_doi_prefix: nil)
    interview = OpenStruct.new(
      interview_date: '2015-08-13',
      archive_id: 'zauber0001',
      doi_status: doi_status,
      used_doi_prefix: used_doi_prefix,
      collection: nil
    )
    interview.define_singleton_method(:anonymous_title) { |_locale| 'M., Anna' }
    interview
  end

  test 'latex_multiscript wraps arabic text' do
    wrapped = latex_multiscript('مرحبا')

    assert_match(/^\\textarabic\{/, wrapped)
    assert_match(/\}\z/, wrapped)
  end

  test 'latex_multiscript wraps hebrew text' do
    wrapped = latex_multiscript('שלום')

    assert_match(/^\\texthebrew\{/, wrapped)
    assert_match(/\}\z/, wrapped)
  end

  test 'latex_multiscript wraps tamil text' do
    wrapped = latex_multiscript('வணக்கம்')

    assert_match(/^\\texttamil\{/, wrapped)
    assert_match(/\}\z/, wrapped)
  end

  test 'latex_multiscript keeps latin runs outside tamil wrapper for mixed text' do
    mixed = latex_multiscript('தமிழ் interview 2026')

    assert_equal('\\texttamil{தமிழ்} interview 2026', mixed)
  end

  test 'latex_multiscript keeps urls readable in mixed tamil text' do
    mixed = latex_multiscript('தமிழ் https://example.org/interviews/A-1')

    assert_equal('\\texttamil{தமிழ்} https://example.org/interviews/A-1', mixed)
  end

  test 'latex_multiscript decodes html entities and escapes latex chars' do
    converted = latex_multiscript('archive&#39;s terms & conditions')

    assert_equal("archive's terms \\& conditions", converted)
  end

  test 'latex_multiscript escapes plain text without wrapping' do
    escaped = latex_multiscript('A & B')

    assert_equal('A \\& B', escaped)
  end

  test 'latex_multiscript returns empty string for nil' do
    assert_equal('', latex_multiscript(nil))
  end

  test 'latex_escape escapes latex special characters' do
    assert_equal('A \\& B', latex_escape('A & B'))
  end

  test 'latex_multiline_text escapes raw text once and preserves latex newline command' do
    escaped = latex_multiline_text("A & B\nC % D")

    assert_equal('A \\& B~\newline~C \\% D', escaped)
  end

  test 'latex_multiline_text converts quotes before escaping observations text' do
    escaped = latex_multiline_text('"quoted" & raw', convert_quotes: true)

    assert_equal('``quoted`` \\& raw', escaped)
  end

  test 'latex_sanitized_multiline_text strips html and escapes raw text once' do
    escaped = latex_sanitized_multiline_text('<p>A &amp; B</p>')

    assert_equal('A \\& B', escaped)
  end

  test 'interview_date_for_pdf keeps multiple valid dates unchanged' do
    value = '03.07.2019,12.07.2019'

    assert_equal value, interview_date_for_pdf(value)
  end

  test 'interview_date_for_pdf falls back to full string for mixed invalid input' do
    value = '03.sdfd07.2019,12.07.2019sdfdsfds'

    assert_equal value, interview_date_for_pdf(value)
  end

  test 'interview_date_for_pdf converts iso date to de style date' do
    assert_equal '13.5.2023', interview_date_for_pdf('2023-05-13', locale: :de)
  end

  test 'interview_date_for_pdf converts iso date to en-US style date' do
    assert_equal '5/13/2023', interview_date_for_pdf('2023-05-13', locale: :en)
  end

  test 'interview_date_for_pdf keeps free-form year range untouched' do
    assert_equal '1979-1981', interview_date_for_pdf('1979-1981')
  end

  test 'interview_date_for_pdf keeps free-form text untouched' do
    assert_equal 'sometime in 2020', interview_date_for_pdf('sometime in 2020')
  end

  test 'interview_date_for_pdf keeps free-form multi-date text untouched' do
    value = '03.07.2019; 12.07.2019/15.08.2019'

    assert_equal value, interview_date_for_pdf(value)
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

  test 'latex_metadata_line returns nil for blank value' do
    assert_nil(latex_metadata_line('Label', ''))
  end

  test 'latex_metadata_line renders script-aware label and value' do
    line = latex_metadata_line('ملاحظات', 'نص عربي')

    assert_equal('\\par{\\textarabic{ملاحظات}: \\textarabic{نص} \\textarabic{عربي}}', line)
  end

  test 'latex_metadata_line does not emit html entities' do
    line = latex_metadata_line("Label", "archive's note")

    refute_match(/&#39;/, line)
    assert_match(/archive's note/, line)
  end

  test 'latex_footer_citation_parts builds footer segments without interview' do
    project = build_project
    parts = latex_footer_citation_parts(interview: nil, project: project, header_locale: :en, doc_type: 'translation')

    assert_includes(parts, 'World Magic')
    assert(parts.any? { |part| part.match?(/^\(\d{2}\.\d{2}\.\d{4}\)$/) })
  end

  test 'latex_footer_citation_parts includes interview and doi segment when doi is created' do
    project = build_project
    interview = build_interview(doi_status: 'created', used_doi_prefix: '10.1234')

    parts = latex_footer_citation_parts(interview: interview, project: project, header_locale: :en, doc_type: 'translation')

    assert(parts.any? { |part| part.include?('zauber0001') })
    assert(parts.any? { |part| part.include?('/en/interviews/zauber0001') })
    assert(parts.any? { |part| part.include?('DOI: https://doi.org/10.1234/') })
  end

  test 'latex_footer_citation_parts omits doi segment when doi prefix is missing' do
    project = build_project
    interview = build_interview(doi_status: 'created', used_doi_prefix: nil)

    parts = latex_footer_citation_parts(interview: interview, project: project, header_locale: :en, doc_type: 'translation')

    assert(parts.none? { |part| part.include?('DOI: https://doi.org/') })
  end

  test 'latex_footer_line renders parts with script-aware wrapping' do
    project = build_project(name: 'مشروع')
    line = latex_footer_line(interview: nil, project: project, header_locale: :en, doc_type: 'translation')

    assert_match(/\\textarabic\{مشروع\}/, line)
    assert_match(/\.\z/, line)
  end

  test 'latex_footer_line keeps archive id and date ltr in arabic footer reference' do
    project = build_project(name: 'عالم السحر')
    interview = build_interview

    line = latex_footer_line(interview: interview, project: project, header_locale: :ar, doc_type: 'transcript')

    assert_match(/\\textenglish\{zauber0001, 13\.8\.2015\}/, line)
  end

  test 'latex_speaker returns ltr speaker prefix for new speaker' do
    person = OpenStruct.new(name: { en: 'Ingmar Interviewer' })
    segment = OpenStruct.new(speaker_id: 7, speaking_person: person)

    speaker_id, rtl_speaker, ltr_speaker = latex_speaker(segment, nil, false, :en)

    assert_equal(7, speaker_id)
    assert_equal('', rtl_speaker)
    assert_equal('Ingmar Interviewer: ', ltr_speaker)
  end

  test 'latex_speaker returns rtl speaker suffix for new speaker' do
    person = OpenStruct.new(name: { ar: 'إنغمار' })
    segment = OpenStruct.new(speaker_id: 9, speaking_person: person)

    speaker_id, rtl_speaker, ltr_speaker = latex_speaker(segment, nil, true, :ar)

    assert_equal(9, speaker_id)
    assert_equal(' :إنغمار', rtl_speaker)
    assert_equal('', ltr_speaker)
  end

  test 'latex_speaker suppresses duplicate speaker labels' do
    person = OpenStruct.new(name: { en: 'Same Speaker' })
    segment = OpenStruct.new(speaker_id: 4, speaking_person: person)

    speaker_id, rtl_speaker, ltr_speaker = latex_speaker(segment, 4, false, :en)

    assert_equal(4, speaker_id)
    assert_equal('', rtl_speaker)
    assert_equal('', ltr_speaker)
  end

  test 'latex_speaker returns empty strings when speaking_person is nil' do
    segment = OpenStruct.new(speaker_id: 5, speaking_person: nil)

    speaker_id, rtl_speaker, ltr_speaker = latex_speaker(segment, 3, false, :en)

    assert_equal(3, speaker_id)
    assert_equal('', rtl_speaker)
    assert_equal('', ltr_speaker)
  end

  test 'latex_speaker returns empty strings when speaking_person is nil with rtl' do
    segment = OpenStruct.new(speaker_id: 8, speaking_person: nil)

    speaker_id, rtl_speaker, ltr_speaker = latex_speaker(segment, 6, true, :ar)

    assert_equal(6, speaker_id)
    assert_equal('', rtl_speaker)
    assert_equal('', ltr_speaker)
  end
end
