namespace :deploy do
  desc 'Show deployed revision'
  task :revision do
    on roles :app do |host|
      within current_path do
        info "#{host}: #{capture :cat, 'REVISION'}"
      end
    end
  end
end
