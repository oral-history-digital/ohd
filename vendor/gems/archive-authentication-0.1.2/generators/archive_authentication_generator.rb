class ArchiveAuthenticationGenerator < Rails::Generator::NamedBase

  def manifest

    record do |m|

      require 'fileutils'

      case file_name

        when /install/i
          puts "Installing tasks:"
          gem_task_dir = File.join(File.dirname(__FILE__), '../tasks')
          app_task_dir = File.join(RAILS_ROOT, 'lib/tasks')
          Dir[File.join(gem_task_dir, '*.rake')].each do |task_file|
            puts task_file.split('/').last
            FileUtils.cp task_file, app_task_dir, :preserve => true
          end
          puts "done."
      end

    end
  end

end