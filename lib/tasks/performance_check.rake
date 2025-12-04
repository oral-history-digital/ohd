# frozen_string_literal: true

namespace :performance do
  require "benchmark"

  # ---------------------------------------------------------------------------
  # AUTH SETUP — Create a test user + Doorkeeper token
  # ---------------------------------------------------------------------------
  def performance_user_and_token(project)
    email = ENV["PERF_USER"] || "jan.kuhn@fu-berlin.de"
    user = User.find_by!(email: email)

    # Ensure the user has membership in the project
    user_project = UserProject.find_or_create_by!(
      user: user,
      project: project
    )
    # Ensure it's usable for access — grant project access
    unless user_project.workflow_state == 'project_access_granted'
      user_project.grant_project_access! rescue nil
    end

    # OAuth application and token
    application = Doorkeeper::Application.first ||
                  Doorkeeper::Application.create!(name: "PerfTestApp")

    token = Doorkeeper::AccessToken.create!(
      application_id: application.id,
      resource_owner_id: user.id,
      scopes: "public",
      expires_in: 2.hours,
      revoked_at: nil
    )

    [user, token.token]
  end

  # ---------------------------------------------------------------------------
  # REAL REQUEST HELPER — Rack::MockRequest runs real controllers/serializers
  # ---------------------------------------------------------------------------
  def hit_get(path, params = {}, extra_headers = {})
    query = params.to_query
    full_path = query.empty? ? path : "#{path}?#{query}"

    # Debug output
    if ENV['DEBUG']
      puts "  DEBUG: path=#{path}"
      puts "  DEBUG: params=#{params.inspect}"
      puts "  DEBUG: full_path=#{full_path}"
    end

    # Parse the OHD_DOMAIN to get host and port
    uri = URI.parse(OHD_DOMAIN)
    http_host = uri.host
    http_host += ":#{uri.port}" if uri.port && ![80, 443].include?(uri.port)

    env = {
      # Doorkeeper token must use HTTP_AUTHORIZATION
      "HTTP_AUTHORIZATION" => "Bearer #{ENV['PERF_TOKEN']}",

      # Set proper host for route matching
      "HTTP_HOST" => http_host,
      "SERVER_NAME" => uri.host,
      "SERVER_PORT" => uri.port.to_s,
      "rack.url_scheme" => uri.scheme,

      # Ensure API behavior
      "HTTP_ACCEPT" => "application/json"
    }.merge(extra_headers)

    req = Rack::MockRequest.new(Rails.application)
    res = req.get(full_path, env)

    # Rack::MockResponse provides status, headers, body methods
    OpenStruct.new(
      status: res.status,
      headers: res.headers,
      body: res.body
    )
  end


  # ---------------------------------------------------------------------------
  # CORE MEASUREMENT LOGIC (detect N+1, slow queries, total time, etc.)
  # ---------------------------------------------------------------------------
  def measure_endpoint(label:, verbose:, show_queries:)
    queries = []
    duplicate_map = {}
    total_query_time = 0.0

    sql_sub = ActiveSupport::Notifications.subscribe("sql.active_record") do |_name, start, finish, _id, payload|
      next if payload[:name] == "SCHEMA"

      duration = (finish - start) * 1000
      sql = payload[:sql]

      queries << { sql: sql, duration: duration }
      total_query_time += duration

      # Normalize SQL to detect duplicates
      norm = sql.gsub(/\d+/, "N").gsub(/'[^']*'/, "?")
      duplicate_map[norm] ||= { count: 0, total_time: 0.0, example: sql }
      duplicate_map[norm][:count] += 1
      duplicate_map[norm][:total_time] += duration
    end

    response = nil
    error = nil
    timeout_seconds = (ENV['TIMEOUT'] || '60').to_i

    elapsed = Benchmark.measure do
      begin
        Timeout.timeout(timeout_seconds) do
          # Silence ActiveRecord logs unless verbose mode
          if verbose || ActiveRecord::Base.logger.nil?
            response = yield
          else
            ActiveRecord::Base.logger.silence do
              response = yield
            end
          end
        end
      rescue Timeout::Error
        error = StandardError.new("Request timed out after #{timeout_seconds} seconds")
      rescue => e
        error = e
      end
    end

    ActiveSupport::Notifications.unsubscribe(sql_sub)

    total_ms = (elapsed.real * 1000).round(2)

    # -------------------------
    # Output
    # -------------------------
    puts "\n📊 #{label}"
    puts "-" * 80
    $stdout.flush

    if error
      puts "❌ ERROR: #{error.class} – #{error.message}"
      puts error.backtrace.first(15).join("\n")
      $stdout.flush
      return
    end

    status_icon = response.status >= 200 && response.status < 300 ? "✓" : "⚠️"
    puts "#{status_icon} Status: #{response.status}"
    
    # Show error details for 500 errors
    if response.status >= 500 && verbose
      puts "\n🔍 Error details:"
      # Try to extract error from HTML
      if response.body =~ /<h2[^>]*>(.+?)<\/h2>/m
        puts "  Error: #{$1.gsub(/<[^>]*>/, '').strip}"
      end
      if response.body =~ /<pre[^>]*class="box"[^>]*>(.*?)<\/pre>/m
        puts "  Message: #{$1.gsub(/<[^>]*>/, '').strip[0..300]}"
      end
    end
    
    puts "⏱️ Total time: #{total_ms}ms"
    puts "🗄️ DB queries: #{queries.count}"
    puts "⏱️ DB time: #{total_query_time.round(2)}ms"
    puts "🧮 Ruby time: #{(total_ms - total_query_time).round(2)}ms"
    $stdout.flush

    # Slow queries
    if verbose && queries.any?
      puts "\n🐌 Slow queries:"
      queries.sort_by { |q| -q[:duration] }
             .first(5)
             .each { |q| puts "  #{q[:duration].round(2)}ms – #{q[:sql][0..120]}..." }
    end

    # N+1 detection
    dupes = duplicate_map.select { |_, v| v[:count] > 1 }
    if dupes.any?
      puts "\n⚠️ Potential N+1 detected:"
      dupes.sort_by { |_, v| -v[:count] }
           .first(5)
           .each do |_, v|
             puts "  Executed #{v[:count]}x (#{v[:total_time].round(2)}ms): #{v[:example][0..120]}..."
           end
      $stdout.flush
    end

    if show_queries
      puts "\n📋 All queries:"
      queries.each_with_index do |q, i|
        puts "#{i + 1}. #{q[:duration].round(2)}ms – #{q[:sql]}"
      end
    end

    {
      status: response.status,
      total_time: total_ms,
      queries: queries,
      duplicates: dupes
    }
  end

  # ---------------------------------------------------------------------------
  # MAIN TASK — REAL ENDPOINT PROFILING
  # ---------------------------------------------------------------------------
  # Usage examples:
  #   # Run all endpoints (default project is auto-picked)
  #   rake performance:check
  #
  #   # Run a single endpoint by name (matches keys in the `endpoints` hash)
  #   ENDPOINT=archive_search rake performance:check
  #   # or using a rake argument (wrap in quotes to avoid shell parsing):
  #   rake "performance:check[archive_search]"
  #
  #   # Force project and locale
  #   PROJECT=za LOCALE=de rake performance:check
  #
  #   # Show DB queries and verbose output
  #   SHOW_QUERIES=true VERBOSE=true rake performance:check
  #
  #   # Provide a custom perf user email (must exist) and timeout (seconds)
  #   PERF_USER=alice@example.com TIMEOUT=120 rake performance:check
  #
  #   # Use an existing OAuth token instead of creating one
  #   PERF_TOKEN=abcdef... rake performance:check
  #
  # Notes:
  #   - Use `ENDPOINT` with the endpoint key (e.g., `search_facets`, `interview_detail`).
  #   - When using the rake-arg form, wrap the task call in quotes to avoid shell parsing.
  #   - Defaults: `PROJECT` picks a public project, `LOCALE` defaults to `en`, `TIMEOUT` defaults to 60s.
  desc "Profile real API endpoint performance. Example: ENDPOINT=search_facets rake performance:check"
  task :check, [:endpoint] => :environment do |_, args|
    puts "🚀 Starting performance check task..."
    $stdout.flush
    
    # Silence DB logs during setup unless VERBOSE is set
    verbose = ENV["VERBOSE"] == "true"
    
    if !verbose
      old_logger = ActiveRecord::Base.logger
      ActiveRecord::Base.logger = nil
    end
    
    project_shortname = ENV["PROJECT"] || Project.where(workflow_state: "public").pick(:shortname)
    locale = ENV["LOCALE"] || "en"
    only_endpoint = args[:endpoint] || ENV["ENDPOINT"]
    show_queries = ENV["SHOW_QUERIES"] == "true"

    project = Project.find_by(shortname: project_shortname)
    interview = project.interviews.shared.first || project.interviews.first
    
    # Restore logger after setup
    ActiveRecord::Base.logger = old_logger if !verbose

    puts "\n==============================================="
    puts "🔍 REAL ENDPOINT PERFORMANCE PROFILING"
    puts "Project: #{project.shortname}"
    puts "Locale: #{locale}"
    puts "Endpoint filter: #{only_endpoint || 'ALL'}"
    puts "===============================================\n"
    $stdout.flush

    # Create authenticated user + token
    user, token = performance_user_and_token(project)
    ENV["PERF_TOKEN"] = token

    puts "Authenticated as: #{user.email}"
    puts "OAuth Token: #{token[0..10]}…"
    puts
    $stdout.flush

    # ---------------------------------------------------------------------
    # Endpoint definitions (real URLs)
    # Build paths with /:project_id/:locale prefix as expected by routes
    # ---------------------------------------------------------------------
    base_path = "/#{project.shortname}/#{locale}"
    
    endpoints = {
      #-------------------------------------------------------------------
      # Endpoints usign the main ohd project (no project prefix)
      #-------------------------------------------------------------------
      search_facets: {
        label: "GET /searches/facets",
        path: "#{locale}/searches/facets", 
        params: {}
      },

      search_suggestions: {
        label: "GET /searches/suggestions",
        path: "#{locale}/searches/suggestions", 
        params: {}
      },

      archive_search: {
        label: "GET /searches/archive.json",
        path: "#{locale}/searches/archive.json", 
        params: { fulltext: "haus", order: "desc", page: 1, sort: "score" }
      },

      archive_search_filtered: {
        label: "GET /searches/archive.json?fulltext=berlin",
        path: "#{locale}/searches/archive.json", 
        params: { fulltext: "berlin" }
      },

      project_detail: {
        label: "GET /projects/:id.json",
        path: "#{locale}/projects/#{project.id}.json",
        params: {}
      },

      interview_search: {
        label: "GET /searches/interview.json?fulltext=history",
        path: "#{locale}/searches/interview.json", 
        params: { fulltext: "history", id: interview.archive_id }
      },

      help_texts: {
        label: "GET /help_texts.json",
        path: "#{locale}/help_texts.json", 
        params: {}
      },

      user_contents: {
        label: "GET /user_contents.json",
        path: "#{locale}/user_contents.json", 
        params: {}
      },

      #-------------------------------------------------------------------
      # Project-specific endpoints
      #-------------------------------------------------------------------
      interview_detail: interview && {
        label: "GET /:pid/interviews/:id.json",
        path: "#{base_path}/interviews/#{interview.archive_id}.json",
        params: {}
      },

      people: {
        label: "GET /:pid/people.json",
        path: "#{base_path}/people.json",
        params: {}
      },

      registry_entries: {
        label: "GET /:pid/registry_entries.json",
        path: "#{base_path}/registry_entries.json",
        params: {}
      },

      collections: {
        label: "GET /:pid/collections.json",
        path: "#{base_path}/collections.json",
        params: {}
      },

      segments: interview && {
        label: "GET /:pid/interviews/:id/segments.json",
        path: "#{base_path}/interviews/#{interview.archive_id}/segments.json",
        params: {}
      },

      photos: interview && {
        label: "GET /:pid/interviews/:id/photos.json",
        path: "#{base_path}/interviews/#{interview.archive_id}/photos.json",
        params: {}
      },

      project_search_suggestions: {
        label: "GET /:pid/searches/suggestions",
        path: "#{base_path}/searches/suggestions",
        params: {}
      },

      interview_description: interview && {
        label: "GET /:pid/interviews/:id/description.json",
        path: "#{base_path}/interviews/#{interview.archive_id}/description.json",
        params: {}
      },

      observations: interview && {
        label: "GET /:pid/interviews/:id/observations.json",
        path: "#{base_path}/interviews/#{interview.archive_id}/observations.json",
        params: {}
      }
      }.compact

    # ---------------------------------------------------------------------
    # Run endpoints
    # ---------------------------------------------------------------------
    endpoints.each_with_index do |(name, cfg), index|
      next if only_endpoint && name.to_s != only_endpoint

      # Show progress indicator before starting
      puts "\n\n"
      puts "-" * 80
      puts "⏳ [#{index + 1}/#{endpoints.size}] Testing #{cfg[:label]}..."
      $stdout.flush
      
      measure_endpoint(
        label: cfg[:label],
        verbose: verbose,
        show_queries: show_queries
      ) do
        hit_get(cfg[:path], cfg[:params])
      end
    end

    puts "\n✅ DONE"
  end
end
