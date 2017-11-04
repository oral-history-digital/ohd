namespace :deploy do
  after :restart, :restart_passenger do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      within release_path do
        execute :mkdir, '-p', "#{ release_path }/tmp"
        execute :touch, 'tmp/restart.txt'
      end
    end
  end
  after :finishing, 'deploy:restart_passenger'
end

#desc 'Restart application'
#task :restart do
  #on roles(:web), in: :sequence, wait: 5 do
    #execute :mkdir, '-p', "#{ release_path }/tmp"
    #execute :touch, release_path.join('tmp/restart.txt')
  #end
#end
