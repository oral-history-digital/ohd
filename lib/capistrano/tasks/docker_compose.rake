require 'shellwords'

namespace :docker do
  def compose_shell(command)
    compose_dir = fetch(:docker_compose_dir)
    compose_file = fetch(:docker_compose_file, 'docker-compose.yml')
    compose_command = fetch(:docker_compose_command, 'docker compose')

    env_parts = []
    project_name = fetch(:docker_compose_project_name, nil)
    image_tag = fetch(:docker_image_tag, nil)

    env_parts << "COMPOSE_PROJECT_NAME=#{project_name}" if project_name
    env_parts << "IMAGE_TAG=#{image_tag}" if image_tag

    env_prefix = env_parts.empty? ? '' : "#{env_parts.join(' ')} "
    "cd #{Shellwords.escape(compose_dir)} && #{env_prefix}#{compose_command} -f #{Shellwords.escape(compose_file)} #{command}"
  end

  def run_compose(command)
    execute :bash, '-lc', compose_shell(command)
  end

  def capture_compose(command)
    capture :bash, '-lc', compose_shell(command)
  end

  desc 'Pull app images for Docker deployment'
  task :pull do
    on primary(:app) do
      services = Array(fetch(:docker_services, %w(app worker))).join(' ')
      run_compose("pull #{services}")
    end
  end

  desc 'Start or update Docker services'
  task :up do
    on primary(:app) do
      services = Array(fetch(:docker_services, %w(app worker))).join(' ')
      run_compose("up -d #{services}")
    end
  end

  desc 'Run Rails migrations in Docker app service'
  task :migrate do
    on primary(:app) do
      next unless fetch(:docker_run_migrations, true)

      migration_service = fetch(:docker_migration_service, 'app')
      run_compose("exec -T #{migration_service} bundle exec rails db:migrate")
    end
  end

  desc 'Show compose status and app logs tail'
  task :verify do
    on primary(:app) do
      services = Array(fetch(:docker_services, %w(app worker))).join(' ')
      log_lines = fetch(:docker_log_lines, 120)
      run_compose("ps #{services}")
      run_compose("logs --tail=#{log_lines} app")
    end
  end

  desc 'Strict verification with fail-fast checks'
  task :verify_strict do
    on primary(:app) do
      # Define services to verify, allowing optional override with :docker_verify_services
      services = Array(fetch(:docker_verify_services, fetch(:docker_services, %w(app worker))))
      log_lines = fetch(:docker_log_lines, 120)

      run_compose("ps #{services.join(' ')}")
      running = capture_compose('ps --services --filter status=running').split
      missing = services.reject { |service| running.include?(service) }
      raise "Missing running services: #{missing.join(', ')}" unless missing.empty?

      if fetch(:docker_verify_db, true)
        migration_service = fetch(:docker_migration_service, 'app')
        run_compose(%(exec -T #{migration_service} bundle exec rails runner "ActiveRecord::Base.connection.execute('SELECT 1')"))
      end

      run_compose("logs --tail=#{log_lines} app") if fetch(:docker_verify_print_logs, true)
    end
  end

  desc 'Deploy via Docker Compose (pull -> up -> migrate -> verify)'
  task :deploy do
    invoke 'docker:pull'
    invoke 'docker:up'
    invoke 'docker:migrate'
    if fetch(:docker_use_strict_verify, true)
      invoke 'docker:verify_strict'
    else
      invoke 'docker:verify'
    end
  end
end
