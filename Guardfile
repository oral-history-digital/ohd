# Integration of spork with guard.
guard 'spork', :rspec_env => { 'RAILS_ENV' => 'test' } do
  watch('config/application.rb')
  watch('config/environment.rb')
  watch('config/environments/test.rb')
  watch(%r{^config/initializers/.+\.rb$})
  watch('Gemfile')
  watch('Gemfile.lock')
  watch('spec/spec_helper.rb') { :rspec }
end

# Rspec support.
guard 'rspec', :version => 1, :all_after_pass => false, :all_on_start => false, :focus_on_failed => true, :cli => '--drb --color' do
  # Watch RSpec directory structure.
  watch(%r{^spec/.+_spec\.rb$})
  watch('spec/spec_helper.rb')         { 'spec' }
  watch(%r{^spec/support/(.+)\.rb$})   { 'spec' }
  watch(%r{^spec/factories/(.+)\.rb$}) { 'spec' }

  # Watch Rails directory structure.
  watch(%r{^lib/(.+)\.rb$})                           { |m| "spec/lib/#{m[1]}_spec.rb" }
  watch(%r{^lib/tasks/(.+)\.rake$})                   { |m| "spec/lib/tasks/#{m[1]}_task_spec.rb" }
  watch(%r{^app/(.+)\.rb$})                           { |m| "spec/#{m[1]}_spec.rb" }
  watch(%r{^app/(.*)(\.erb|\.haml)$})                 { |m| "spec/#{m[1]}#{m[2]}_spec.rb" }
  watch(%r{^app/controllers/(.+)_(controller)\.rb$})  { |m| ["spec/routing/#{m[1]}_routing_spec.rb", "spec/#{m[2]}s/#{m[1]}_#{m[2]}_spec.rb", "spec/acceptance/#{m[1]}_spec.rb"] }
  watch('config/routes.rb')                           { 'spec/routing' }
  watch('app/controllers/application_controller.rb')  { 'spec/controllers' }
  watch(%r{^app/views/(.+)/.*\.(erb|haml)$})          { |m| "spec/requests/#{m[1]}_spec.rb" }
end
