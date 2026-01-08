namespace :test_coverage do
  desc "Generate API endpoint test coverage overview report"
  task :report => :environment do
    require 'json'
    require 'fileutils'

    coverage_reporter = ApiEndpointCoverageReporter.new
    report = coverage_reporter.generate_report
    
    puts "\n" + "="*80
    puts "API ENDPOINT TEST COVERAGE REPORT"
    puts "="*80
    puts report[:summary]
    puts "\n" + "-"*80
    puts "COVERAGE BREAKDOWN BY CONTROLLER"
    puts "-"*80
    
    report[:by_controller].each do |controller_name, data|
      status = data[:has_tests] ? "✓" : "✗"
      pct = data[:method_count] > 0 ? (data[:tested_methods] * 100 / data[:method_count]).to_i : 0
      puts "#{status} #{controller_name.ljust(40)} #{data[:tested_methods]}/#{data[:method_count]} methods (#{pct}%)"
    end

    puts "\n" + "-"*80
    puts "CONTROLLERS WITHOUT TESTS"
    puts "-"*80
    untested = report[:by_controller].select { |_, d| !d[:has_tests] }
    if untested.any?
      untested.each do |name, data|
        puts "  • #{name} (#{data[:method_count]} public methods)"
      end
    else
      puts "  All controllers have at least one test!"
    end

    puts "\n" + "-"*80
    puts "CONTROLLERS WITH PARTIAL TEST COVERAGE"
    puts "-"*80
    partial = report[:by_controller].select do |_, d|
      d[:has_tests] && d[:tested_methods] > 0 && d[:tested_methods] < d[:method_count]
    end
    
    if partial.any?
      partial.each do |name, data|
        pct = (data[:tested_methods] * 100 / data[:method_count]).to_i
        puts "  • #{name}: #{data[:tested_methods]}/#{data[:method_count]} (#{pct}%)"
      end
    else
      puts "  (none)"
    end

    puts "\n" + "="*80
    puts "SUMMARY"
    puts "="*80
    puts "Total Controllers: #{report[:total_controllers]}"
    puts "Controllers with Tests: #{report[:tested_controllers]}"
    puts "Coverage Rate: #{report[:coverage_percentage]}%"
    puts "Overall Test-to-Controller Ratio: #{report[:tested_controllers]}/#{report[:total_controllers]}"
    puts "="*80 + "\n"

    # Save JSON report
    report_file = Rails.root.join('tmp', 'coverage_report.json')
    FileUtils.mkdir_p(File.dirname(report_file))
    File.write(report_file, JSON.pretty_generate(report))
    puts "Detailed JSON report saved to: #{report_file}"
  end

  desc "Generate detailed API endpoint coverage HTML report"
  task :html_report => :environment do
    require 'json'
    require 'fileutils'

    coverage_reporter = ApiEndpointCoverageReporter.new
    report = coverage_reporter.generate_report

    html_file = Rails.root.join('tmp', 'coverage_report.html')
    FileUtils.mkdir_p(File.dirname(html_file))
    
    html_content = generate_html_report(report)
    File.write(html_file, html_content)
    
    puts "HTML report generated: #{html_file}"
    puts "Open in browser: file://#{html_file}"
  end
end

def generate_html_report(report)
  coverage_pct = report[:coverage_percentage]
  color = coverage_pct >= 80 ? '#28a745' : coverage_pct >= 50 ? '#ffc107' : '#dc3545'
  
  %{<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>API Endpoint Test Coverage Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-bottom: 10px; }
    .subtitle { color: #666; font-size: 14px; margin-bottom: 30px; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .summary-card { padding: 20px; border-radius: 8px; background: #f9f9f9; border-left: 4px solid #007bff; }
    .summary-card h3 { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 10px; }
    .summary-card .value { font-size: 32px; font-weight: bold; color: #{color}; }
    .progress-bar { width: 100%; height: 30px; background: #e9ecef; border-radius: 4px; overflow: hidden; margin-top: 10px; }
    .progress-fill { height: 100%; background: #{color}; width: #{coverage_pct}%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    th { background: #f1f1f1; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    tr:hover { background: #f9f9f9; }
    .status-yes { color: #28a745; font-weight: 600; }
    .status-no { color: #dc3545; font-weight: 600; }
    .progress-cell { max-width: 300px; }
    .progress-bar-small { height: 20px; background: #e9ecef; border-radius: 3px; overflow: hidden; }
    .progress-fill-small { height: 100%; background: #007bff; display: flex; align-items: center; justify-content: center; font-size: 11px; color: white; }
    .section-title { font-size: 18px; font-weight: 600; color: #333; margin-top: 40px; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
    .stat-box { padding: 15px; background: #f9f9f9; border-radius: 6px; }
    .stat-box .label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
    .stat-box .number { font-size: 24px; font-weight: bold; color: #333; }
    .untested-list { list-style: none; }
    .untested-list li { padding: 10px; background: #fff3cd; border-left: 4px solid #ffc107; margin-bottom: 8px; border-radius: 4px; }
    .tested-list li { padding: 10px; background: #d4edda; border-left: 4px solid #28a745; margin-bottom: 8px; border-radius: 4px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>API Endpoint Test Coverage Report</h1>
    <div class="subtitle">Generated: #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}</div>

    <div class="summary-grid">
      <div class="summary-card">
        <h3>Overall Coverage</h3>
        <div class="value">#{coverage_pct}%</div>
        <div class="progress-bar">
          <div class="progress-fill">#{coverage_pct}%</div>
        </div>
      </div>
      <div class="summary-card">
        <h3>Controllers Tested</h3>
        <div class="value">#{report[:tested_controllers]}/#{report[:total_controllers]}</div>
      </div>
      <div class="summary-card">
        <h3>Methods Coverage</h3>
        <div class="value">#{report[:total_tested_methods]}/#{report[:total_methods]}</div>
      </div>
    </div>

    <div class="section-title">Coverage by Controller</div>
    <table>
      <thead>
        <tr>
          <th>Controller</th>
          <th>Has Tests</th>
          <th>Methods Tested</th>
          <th>Coverage %</th>
        </tr>
      </thead>
      <tbody>
        #{report[:by_controller].map do |name, data|
          tested = data[:has_tests] ? '<span class="status-yes">✓ Yes</span>' : '<span class="status-no">✗ No</span>'
          pct = data[:method_count] > 0 ? (data[:tested_methods] * 100 / data[:method_count]).to_i : 0
          "<tr>
            <td>#{name}</td>
            <td>#{tested}</td>
            <td>#{data[:tested_methods]}/#{data[:method_count]}</td>
            <td>
              <div class='progress-bar-small'>
                <div class='progress-fill-small' style='width: #{pct}%'>#{pct}%</div>
              </div>
            </td>
          </tr>"
        end.join}
      </tbody>
    </table>

    <div class="section-title">Controllers Requiring Tests</div>
    #{if report[:by_controller].any? { |_, d| !d[:has_tests] }
      "<ul class='untested-list'>
        #{report[:by_controller].select { |_, d| !d[:has_tests] }.map do |name, data|
          "<li><strong>#{name}</strong> (#{data[:method_count]} public methods)</li>"
        end.join}
      </ul>"
    else
      "<p style='color: #28a745;'><strong>✓</strong> All controllers have at least one test!</p>"
    end}

    <div class="section-title">Controllers with Partial Coverage</div>
    #{if report[:by_controller].any? { |_, d| d[:has_tests] && d[:tested_methods] > 0 && d[:tested_methods] < d[:method_count] }
      "<ul class='tested-list'>
        #{report[:by_controller].select { |_, d| d[:has_tests] && d[:tested_methods] > 0 && d[:tested_methods] < d[:method_count] }.map do |name, data|
          pct = (data[:tested_methods] * 100 / data[:method_count]).to_i
          "<li><strong>#{name}</strong>: #{data[:tested_methods]}/#{data[:method_count]} methods (#{pct}%)</li>"
        end.join}
      </ul>"
    else
      "<p style='color: #999;'><em>None</em></p>"
    end}

    <div class="footer">
      <p>Report includes all public action methods in API controllers (excluding admin controllers).</p>
    </div>
  </div>
</body>
</html>}
end

class ApiEndpointCoverageReporter
  def generate_report
    controllers = get_all_controllers
    test_files = get_all_test_files
    
    controller_data = {}
    
    controllers.each do |controller_path|
      controller_name = extract_controller_name(controller_path)
      methods = extract_public_methods(controller_path)
      test_file = find_test_file(controller_name, test_files)
      tested_methods = test_file ? extract_tested_methods(test_file, controller_name) : []
      
      controller_data[controller_name] = {
        path: controller_path,
        method_count: methods.count,
        tested_methods: tested_methods.count,
        has_tests: test_file.present?,
        test_file: test_file,
        methods: methods,
        tested_methods_list: tested_methods
      }
    end

    total_controllers = controller_data.count
    tested_controllers = controller_data.count { |_, d| d[:tested_methods] > 0 }
    total_methods = controller_data.values.sum { |d| d[:method_count] }
    total_tested = controller_data.values.sum { |d| d[:tested_methods] }
    coverage_pct = total_methods > 0 ? (total_tested * 100 / total_methods).to_i : 0

    {
      summary: build_summary(total_controllers, tested_controllers, total_methods, total_tested, coverage_pct),
      total_controllers: total_controllers,
      tested_controllers: tested_controllers,
      total_methods: total_methods,
      total_tested_methods: total_tested,
      coverage_percentage: coverage_pct,
      by_controller: controller_data
    }
  end

  private

  def get_all_controllers
    Dir.glob(Rails.root.join('app/controllers/**/*_controller.rb')).reject do |path|
      path.include?('/admin/')
    end
  end

  def get_all_test_files
    Dir.glob(Rails.root.join('test/controllers/**/*_test.rb'))
  end

  def extract_controller_name(path)
    File.basename(path, '.rb').camelize
  end

  def extract_public_methods(controller_path)
    content = File.read(controller_path)
    # Match method definitions (def method_name) but exclude private/protected
    # Look for 'def ' followed by method name, excluding private/protected declarations
    methods = []
    in_private = false
    in_protected = false
    
    content.split("\n").each do |line|
      in_private = true if line.strip == 'private'
      in_protected = true if line.strip == 'protected'
      
      next if in_private || in_protected
      
      if line.match?(/^\s*def\s+\w+/)
        method_name = line.match(/def\s+(\w+)/)[1]
        methods << method_name unless ['initialize'].include?(method_name)
      end
    end
    
    methods.uniq
  end

  def find_test_file(controller_name, test_files)
    simple_name = controller_name.sub('Controller', '').underscore
    test_files.find do |file|
      file.include?(simple_name)
    end
  end

  def extract_tested_methods(test_file, controller_name)
    content = File.read(test_file)
    # Look for test method definitions in Minitest files
    tested = Set.new
    
    # For Minitest: look for test_:action patterns and extract the action name
    # e.g., test_index_html, test_index_json, test_show_not_found -> index, show
    content.scan(/def\s+test_(\w+)/).each do |match|
      test_name = match[0]
      # Extract base action name (strip suffix patterns)
      # Handles: _html, _json, _xml, _not_found, _invalid_params, _with_search_params, _success, _error, etc.
      action_name = test_name.gsub(/_(?:html|json|xml|not_found|invalid.*|with.*|success|error)$/, '')
      tested << action_name
    end
    
    tested.to_a
  end

  def build_summary(total, tested, total_methods, tested_methods, coverage)
    %{
API Endpoint Test Coverage Summary
─────────────────────────────────

Total API Controllers: #{total}
Controllers with Tests: #{tested} (#{tested > 0 ? (tested * 100 / total).to_i : 0}%)
Total Public Methods: #{total_methods}
Methods Covered: #{tested_methods}
Overall Coverage: #{coverage}%
    }.strip
  end
end
