class ArchiveAuthenticationGenerator < Rails::Generator::NamedBase

  def manifest

    record do |m|

      require 'fileutils'

      case file_name

        when /install/i
          puts "Installing views:"
          gem_views_dir = File.join(File.dirname(__FILE__), '../app/views')
          app_views_dir = File.join(RAILS_ROOT, 'app/views')
          Dir.glob(File.join(gem_views_dir, '**', '*.erb')).each do |view_file|
            relative_view_path = view_file.sub(gem_views_dir, '')
            puts relative_view_path
            FileUtils.cp view_file, File.join(app_views_dir, relative_view_path), :preserve => true
          end
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