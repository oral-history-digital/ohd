# frozen_string_literal: true

namespace :performance do
  desc "Check endpoint performance with real database to identify bottlenecks"
  task check: :environment do
    ActiveRecord::Base.logger.silence do
    require 'benchmark'
    
    # Configuration
    project_shortname = ENV['PROJECT'] || Project.where(workflow_state: 'public').pluck(:shortname).first
    locale = ENV['LOCALE'] || 'en'
    verbose = ENV['VERBOSE'] == 'true'
    show_queries = ENV['SHOW_QUERIES'] == 'true'
    
    unless project_shortname
      puts "❌ No projects found in database"
      exit 1
    end
    
    project = nil
    ActiveRecord::Base.logger.silence do
      project = Project.find_by(shortname: project_shortname)
    end
    unless project
      puts "❌ Project not found: #{project_shortname}"
      puts "Available projects: #{Project.pluck(:shortname).join(', ')}"
      exit 1
    end
    
    puts "\n" + "=" * 80
    puts "🔍 PERFORMANCE CHECK FOR REAL DATABASE"
    puts "=" * 80
    puts "Project: #{project.shortname} (#{project.name})"
    puts "Locale: #{locale}"
    puts "Time: #{Time.now}"
    puts "Environment: #{Rails.env}"
    puts "=" * 80 + "\n"
    
    # Performance measurement helper
    def measure_endpoint(label:, verbose: false, show_queries: false)
      queries = []
      query_times = {}
      total_query_time = 0.0
      
      query_subscriber = ActiveSupport::Notifications.subscribe('sql.active_record') do |name, start, finish, id, payload|
        next if payload[:name] == 'SCHEMA'
        
        sql = payload[:sql]
        duration = (finish - start) * 1000 # milliseconds
        
        queries << {
          sql: sql,
          duration: duration,
          name: payload[:name]
        }
        total_query_time += duration
        
        # Track duplicate queries
        query_key = sql.gsub(/\d+/, 'N').gsub(/'[^']*'/, '?')
        query_times[query_key] ||= { count: 0, total_time: 0, example: sql }
        query_times[query_key][:count] += 1
        query_times[query_key][:total_time] += duration
      end
      
      result = nil
      error = nil
      elapsed_time = Benchmark.measure do
        ActiveRecord::Base.logger.silence do
          begin
            result = yield
          rescue => e
            error = e
          end
        end
      end
      
      ActiveSupport::Notifications.unsubscribe(query_subscriber)
      
      total_time = (elapsed_time.real * 1000).round(2)
      
      # Print summary
      puts "\n📊 #{label}"
      puts "-" * 80
      
      if error
        puts "❌ ERROR: #{error.class}: #{error.message}"
        puts error.backtrace.first(5).join("\n") if verbose
      else
        puts "✓ Success"
      end
      
      puts "⏱️  Total time: #{total_time}ms"
      puts "🗄️  Database queries: #{queries.size}"
      puts "⏱️  Database time: #{total_query_time.round(2)}ms (#{(total_query_time / total_time * 100).round(1)}%)"
      puts "🧮 Ruby time: #{(total_time - total_query_time).round(2)}ms"
      
      # Show slowest queries
      slow_queries = queries.sort_by { |q| -q[:duration] }.first(5)
      if slow_queries.any? && verbose
        puts "\n🐌 Top 5 slowest queries:"
        slow_queries.each_with_index do |q, i|
          puts "  #{i + 1}. #{q[:duration].round(2)}ms - #{q[:sql].first(100)}..."
        end
      end
      
      # Show duplicate queries (potential N+1)
      duplicates = query_times.select { |k, v| v[:count] > 1 }.sort_by { |k, v| -v[:count] }
      if duplicates.any?
        puts "\n⚠️  Potential N+1 queries detected:"
        duplicates.first(5).each do |pattern, stats|
          puts "  • Executed #{stats[:count]}x (#{stats[:total_time].round(2)}ms total)"
          puts "    SQL: #{stats[:example].first(100)}..."
        end
      end
      
      # Show all queries if requested
      if show_queries && queries.any?
        puts "\n📋 All queries (#{queries.size}):"
        queries.each_with_index do |q, i|
          puts "  #{i + 1}. [#{q[:duration].round(2)}ms] #{q[:sql]}"
        end
      end
      
      puts "-" * 80
      
      {
        success: error.nil?,
        error: error,
        total_time: total_time,
        query_count: queries.size,
        query_time: total_query_time,
        queries: queries,
        duplicates: duplicates
      }
    end
    
    # Helper to measure Solr search performance
    def measure_solr_search(label:, verbose: false)
      solr_time = nil
      solr_hits = nil
      
      # Subscribe to Solr notifications if available
      solr_subscriber = ActiveSupport::Notifications.subscribe('search.sunspot') do |name, start, finish, id, payload|
        solr_time = ((finish - start) * 1000).round(2)
      end
      
      stats = measure_endpoint(label: label, verbose: verbose) do
        search_result = yield
        solr_hits = search_result.total if search_result.respond_to?(:total)
        search_result
      end
      
      ActiveSupport::Notifications.unsubscribe(solr_subscriber)
      
      if solr_time
        puts "🔍 Solr time: #{solr_time}ms"
        puts "📄 Solr hits: #{solr_hits}" if solr_hits
      end
      
      stats
    end
    
    interview = nil
    ActiveRecord::Base.logger.silence do
      interview = project.interviews.shared.first || project.interviews.first
    end
    
    puts "\n" + "=" * 80
    puts "🎯 TESTING CRITICAL ENDPOINTS"
    puts "=" * 80
    
    if interview.nil?
      puts "\n⚠️  No interviews found in project #{project.shortname}"
      puts "Some tests will be skipped."
    end
    
    # Test 1: Search Facets (reported as very slow)
    puts "\n\n🔥 TEST 1: SEARCH FACETS (Known Slow in Production)"
    puts "=" * 80
    
    stats = measure_endpoint(
      label: "GET /searches/facets",
      verbose: verbose,
      show_queries: show_queries
    ) do
      search = Interview.archive_search(nil, project, locale, {})
      project.updated_search_facets(search)
    end
    
    if stats[:total_time] > 1000
      puts "\n⚠️  WARNING: Facets endpoint is SLOW (#{stats[:total_time]}ms)"
      puts "   Recommended: < 500ms for good UX"
    end
    
    if stats[:query_count] > 50
      puts "\n⚠️  WARNING: Too many database queries (#{stats[:query_count]})"
      puts "   Check for N+1 queries in Project#updated_search_facets"
    end
    
    # Test 2: Search Suggestions (reported as very slow)
    puts "\n\n🔥 TEST 2: SEARCH SUGGESTIONS (Known Slow in Production)"
    puts "=" * 80
    
    stats = measure_endpoint(
      label: "GET /searches/suggestions",
      verbose: verbose,
      show_queries: show_queries
    ) do
      # Simulate suggestions request
      term = "test"
      Interview.search do
        fulltext term
        with(:project_id, project.id)
        with(:workflow_state, 'public')
        paginate page: 1, per_page: 5
      end
    end
    
    if stats[:total_time] > 500
      puts "\n⚠️  WARNING: Suggestions endpoint is SLOW (#{stats[:total_time]}ms)"
      puts "   Suggestions should be < 200ms for good UX"
    end
    
    # Test 3: Full Archive Search
    puts "\n\n📚 TEST 3: ARCHIVE SEARCH"
    puts "=" * 80
    
    stats = measure_endpoint(
      label: "GET /searches/archive.json",
      verbose: verbose,
      show_queries: show_queries
    ) do
      Interview.archive_search(nil, project, locale, { page: 1, per_page: 10 })
    end
    
    # Test 4: Search with filters
    puts "\n\n🔍 TEST 4: ARCHIVE SEARCH WITH FILTERS"
    puts "=" * 80
    
    stats = measure_endpoint(
      label: "GET /searches/archive.json?fulltext=berlin",
      verbose: verbose,
      show_queries: show_queries
    ) do
      Interview.archive_search(nil, project, locale, {
        fulltext: 'berlin',
        page: 1,
        per_page: 10
      })
    end
    
    # Test 5: Interview detail
    if interview
      puts "\n\n📄 TEST 5: INTERVIEW DETAIL"
      puts "=" * 80
      
      stats = measure_endpoint(
        label: "GET /interviews/#{interview.archive_id}.json",
        verbose: verbose,
        show_queries: show_queries
      ) do
        # Simulate controller behavior
        Interview.includes(
          :project,
          :contributions,
          :registry_references,
          :segments,
          :photos
        ).find(interview.id)
      end
    end
    
    # Test 6: Registry Entries
    puts "\n\n🏷️  TEST 6: REGISTRY ENTRIES"
    puts "=" * 80
    
    stats = measure_endpoint(
      label: "GET /registry_entries.json",
      verbose: verbose,
      show_queries: show_queries
    ) do
      RegistryEntry
        .where(project_id: project.id)
        .includes(:translations)
        .limit(20)
        .to_a
    end
    
    # Test 7: People/Persons listing
    puts "\n\n👥 TEST 7: PEOPLE LISTING"
    puts "=" * 80
    
    stats = measure_endpoint(
      label: "GET /people.json",
      verbose: verbose,
      show_queries: show_queries
    ) do
      Person
        .where(project_id: project.id)
        .includes(:biographical_entries, :translations)
        .limit(20)
        .to_a
    end
    
    # Test 8: Collections
    puts "\n\n📚 TEST 8: COLLECTIONS"
    puts "=" * 80
    
    stats = measure_endpoint(
      label: "GET /collections.json",
      verbose: verbose,
      show_queries: show_queries
    ) do
      Collection
        .where(project_id: project.id)
        .includes(:translations)
        .to_a
    end
    
    # Test 9: Segments for Interview (SUSPECTED N+1)
    if interview
      puts "\n\n🔥 TEST 9: SEGMENTS.JSON FOR INTERVIEW (Suspected N+1)"
      puts "=" * 80
      puts "Interview: #{interview.archive_id}"
      segments_count = ActiveRecord::Base.logger.silence { interview.segments.count }
      puts "Segments count: #{segments_count}"
      
      # Test with cache disabled to see true N+1 impact
      Rails.cache.clear
      
      stats = measure_endpoint(
        label: "GET /interviews/#{interview.archive_id}/segments.json (cache cleared)",
        verbose: verbose,
        show_queries: show_queries
      ) do
        # Simulate the controller action and policy scope
        user = User.first || User.create!(email: 'test@example.com', password: 'password123')
        project_context = ProjectContext.new(user, project)
        segment = interview.segments.first || Segment.new(interview: interview)
        
        # Clear cache for this specific request to see N+1 impact
        Rails.cache.delete("interview-segments-admin-#{interview.id}-#{interview.segments.maximum(:updated_at)}")
        Rails.cache.delete("interview-segments-restricted-#{interview.id}-#{interview.segments.maximum(:updated_at)}")
        
        SegmentPolicy::Scope.new(project_context, segment).resolve
      end
      
      if stats[:total_time] > 2000
        puts "\n⚠️  WARNING: Segments endpoint is VERY SLOW (#{stats[:total_time]}ms)"
        puts "   Should be < 1000ms for good UX"
      end
      
      if stats[:query_count] > 100
        puts "\n⚠️  WARNING: Too many database queries (#{stats[:query_count]})"
        puts "   Strong indication of N+1 queries"
      end
      
      if stats[:duplicates].any?
        puts "\n🚨 CONFIRMED N+1 ISSUES:"
        puts "   This endpoint needs eager loading optimization!"
      end
    end
    
    # Database statistics
    puts "\n\n" + "=" * 80
    puts "📊 DATABASE STATISTICS"
    puts "=" * 80
    
    stats = ActiveRecord::Base.logger.silence do
      {
        'Interviews' => Interview.where(project_id: project.id).count,
        'Segments' => Segment.joins(:interview).where(interviews: { project_id: project.id }).count,
        'Registry Entries' => RegistryEntry.where(project_id: project.id).count,
        'Registry References' => RegistryReference.joins(:interview).where(interviews: { project_id: project.id }).count,
        'People' => Person.where(project_id: project.id).count,
        'Collections' => Collection.where(project_id: project.id).count,
        'Users' => User.joins(:user_projects).where(user_projects: { project_id: project.id }).distinct.count
      }
    end
    
    stats.each do |model, count|
      puts "  #{model.ljust(20)}: #{count.to_s.rjust(8)}"
    end
    
    # Cache statistics
    puts "\n" + "=" * 80
    puts "💾 CACHE CONFIGURATION"
    puts "=" * 80
    puts "  Cache store: #{Rails.cache.class}"
    puts "  Caching enabled: #{ActionController::Base.perform_caching}"
    
    # Solr health check
    puts "\n" + "=" * 80
    puts "🔍 SOLR HEALTH CHECK"
    puts "=" * 80
    
    begin
      search = nil
      ActiveRecord::Base.logger.silence do
        search = Interview.search { with(:project_id, project.id); paginate page: 1, per_page: 1 }
      end
      puts "  ✓ Solr is responding"
      puts "  Indexed interviews: #{search.total}"
    rescue => e
      puts "  ❌ Solr error: #{e.message}"
      puts "  Try: bin/start_search && bin/rake sunspot:reindex"
    end
    
    puts "\n" + "=" * 80
    puts "✅ PERFORMANCE CHECK COMPLETE"
    puts "=" * 80
    puts "\nTips for investigation:"
    puts "  • Run with VERBOSE=true for detailed query analysis"
    puts "  • Run with SHOW_QUERIES=true to see all SQL queries"
    puts "  • Use PROJECT=xyz to test specific projects"
    puts "  • Check log/development.log for full request logs"
    puts "  • Profile specific slow queries with EXPLAIN ANALYZE"
    puts "\nExample: VERBOSE=true SHOW_QUERIES=true PROJECT=mog bin/rake performance:check"
    puts "=" * 80 + "\n"
    end
  end
  
  desc "Profile a specific search query in detail"
  task :profile_search, [:query_term] => :environment do |t, args|
    require 'benchmark'
    
    query_term = args[:query_term] || ENV['QUERY'] || ''
    project_shortname = ENV['PROJECT'] || Project.first&.shortname
    locale = ENV['LOCALE'] || 'en'
    
    project = Project.find_by(shortname: project_shortname)
    
    puts "\n" + "=" * 80
    puts "🔬 DETAILED SEARCH PROFILING"
    puts "=" * 80
    puts "Project: #{project.shortname}"
    puts "Query: #{query_term.inspect}"
    puts "Locale: #{locale}"
    puts "=" * 80 + "\n"
    
    # Profile the search
    queries = []
    query_subscriber = ActiveSupport::Notifications.subscribe('sql.active_record') do |name, start, finish, id, payload|
      next if payload[:name] == 'SCHEMA'
      queries << {
        sql: payload[:sql],
        duration: ((finish - start) * 1000).round(2),
        backtrace: caller[0..5]
      }
    end
    
    solr_logs = []
    solr_subscriber = ActiveSupport::Notifications.subscribe('search.sunspot') do |name, start, finish, id, payload|
      solr_logs << {
        duration: ((finish - start) * 1000).round(2),
        payload: payload
      }
    end
    
    result = nil
    total_time = Benchmark.measure do
      result = Interview.archive_search(nil, project, locale, {
        fulltext: query_term,
        page: 1,
        per_page: 10
      })
    end
    
    ActiveSupport::Notifications.unsubscribe(query_subscriber)
    ActiveSupport::Notifications.unsubscribe(solr_subscriber)
    
    puts "Results: #{result.total} interviews found"
    puts "Total time: #{(total_time.real * 1000).round(2)}ms"
    puts "Database queries: #{queries.size}"
    puts "Solr requests: #{solr_logs.size}"
    
    if solr_logs.any?
      puts "\nSolr timing:"
      solr_logs.each { |log| puts "  #{log[:duration]}ms" }
    end
    
    puts "\nDatabase queries:"
    queries.each_with_index do |q, i|
      puts "\n#{i + 1}. [#{q[:duration]}ms]"
      puts "   #{q[:sql]}"
      if ENV['BACKTRACE'] == 'true'
        puts "   Called from:"
        q[:backtrace].each { |line| puts "     #{line}" }
      end
    end
    
    puts "\n" + "=" * 80 + "\n"
  end
  
  desc "Profile search facets in detail"
  task profile_facets: :environment do
    require 'benchmark'
    
    project_shortname = ENV['PROJECT'] || Project.first&.shortname
    locale = ENV['LOCALE'] || 'en'
    
    project = Project.find_by(shortname: project_shortname)
    
    puts "\n" + "=" * 80
    puts "🔬 DETAILED FACETS PROFILING"
    puts "=" * 80
    puts "Project: #{project.shortname}"
    puts "Locale: #{locale}"
    puts "=" * 80 + "\n"
    
    # Step 1: Measure search creation
    search = nil
    step1_time = Benchmark.measure do
      search = Interview.archive_search(nil, project, locale, {})
    end
    puts "Step 1 - Create search: #{(step1_time.real * 1000).round(2)}ms"
    
    # Step 2: Measure facets processing
    queries = []
    query_subscriber = ActiveSupport::Notifications.subscribe('sql.active_record') do |name, start, finish, id, payload|
      next if payload[:name] == 'SCHEMA'
      queries << {
        sql: payload[:sql],
        duration: ((finish - start) * 1000).round(2)
      }
    end
    
    facets = nil
    step2_time = Benchmark.measure do
      facets = project.updated_search_facets(search)
    end
    
    ActiveSupport::Notifications.unsubscribe(query_subscriber)
    
    puts "Step 2 - Process facets: #{(step2_time.real * 1000).round(2)}ms"
    puts "  Database queries: #{queries.size}"
    
    total_query_time = queries.sum { |q| q[:duration] }
    puts "  Query time: #{total_query_time.round(2)}ms"
    puts "  Ruby time: #{((step2_time.real * 1000) - total_query_time).round(2)}ms"
    
    puts "\nFacet fields retrieved: #{facets.keys.join(', ')}"
    
    puts "\n🐌 Slowest queries:"
    queries.sort_by { |q| -q[:duration] }.first(10).each_with_index do |q, i|
      puts "\n#{i + 1}. [#{q[:duration]}ms]"
      puts "   #{q[:sql]}"
    end
    
    # Check for N+1 patterns
    query_patterns = queries.group_by { |q| q[:sql].gsub(/\d+/, 'N').gsub(/'[^']*'/, '?') }
    duplicates = query_patterns.select { |k, v| v.size > 1 }
    
    if duplicates.any?
      puts "\n⚠️  Duplicate query patterns (potential N+1):"
      duplicates.sort_by { |k, v| -v.size }.first(5).each do |pattern, queries|
        total_time = queries.sum { |q| q[:duration] }
        puts "\n  Executed #{queries.size}x (total: #{total_time.round(2)}ms)"
        puts "  #{queries.first[:sql].first(150)}..."
      end
    end
    
    puts "\n" + "=" * 80 + "\n"
  end
  
  desc "Check database indexes for optimization opportunities"
  task check_indexes: :environment do
    puts "\n" + "=" * 80
    puts "📇 DATABASE INDEX ANALYSIS"
    puts "=" * 80 + "\n"
    
    # Key tables to check
    tables = %w[
      interviews
      segments
      registry_entries
      registry_references
      people
      contributions
      user_projects
    ]
    
    tables.each do |table|
      next unless ActiveRecord::Base.connection.table_exists?(table)
      
      puts "\n#{table.upcase}"
      puts "-" * 40
      
      indexes = ActiveRecord::Base.connection.indexes(table)
      puts "Indexes (#{indexes.size}):"
      indexes.each do |idx|
        columns = idx.columns.is_a?(Array) ? idx.columns.join(', ') : idx.columns
        unique = idx.unique ? ' [UNIQUE]' : ''
        puts "  • #{idx.name}: #{columns}#{unique}"
      end
      
      # Get table size
      if ActiveRecord::Base.connection.adapter_name == 'Mysql2'
        result = ActiveRecord::Base.connection.execute("
          SELECT 
            table_rows,
            ROUND(data_length / 1024 / 1024, 2) as size_mb,
            ROUND(index_length / 1024 / 1024, 2) as index_size_mb
          FROM information_schema.tables 
          WHERE table_schema = DATABASE()
          AND table_name = '#{table}'
        ").first
        
        if result
          puts "Size: #{result[1]}MB data, #{result[2]}MB indexes, ~#{result[0]} rows"
        end
      end
    end
    
    puts "\n" + "=" * 80
    puts "💡 Optimization tips:"
    puts "  • Ensure foreign keys have indexes (project_id, interview_id, etc.)"
    puts "  • Add composite indexes for common WHERE clauses"
    puts "  • Check for unused indexes with: SHOW INDEX FROM table;"
    puts "=" * 80 + "\n"
  end
end
