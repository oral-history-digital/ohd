# Minitest support.
guard 'minitest', :all_after_pass => false, :all_on_start => false, :focus_on_failed => true do
  # Watch test directory.
  watch(%r{^test/.+_test\.rb$})
  watch(%r{^test/system/.+_test\.rb$})
  watch('test/test_helper.rb') { 'test' }
  watch(%r{^test/support/(.+)\.rb$}) { 'test' }

  # Watch Rails directory structure.
  watch(%r{^lib/(.+)\.rb$})                  { |m| "test/lib/#{m[1]}_test.rb" }
  watch(%r{^app/(.+)\.rb$})                  { |m| "test/#{m[1]}_test.rb" }
  watch(%r{^app/controllers/(.+)_controller\.rb$}) { |m| "test/controllers/#{m[1]}_controller_test.rb" }
  watch('config/routes.rb')                  { 'test/controllers' }
  watch('app/controllers/application_controller.rb') { 'test/controllers' }
end

guard 'cucumber', :all_after_pass => false, :all_on_start => false, :cli => '--drb' do
  watch(%r{^features/.+\.feature$})
  watch(%r{^features/support/.+$})          { 'features' }
  watch(%r{^features/step_definitions/(.+)_steps\.rb$}) { |m| Dir[File.join("**/#{m[1]}.feature")][0] || 'features' }
end
