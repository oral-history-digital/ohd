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
            FileUtils.mkdir_p File.join(app_views_dir, (relative_view_path.split('/') - [ relative_view_path.split('/').last ]).join('/'))
            FileUtils.cp_r view_file, File.join(app_views_dir, relative_view_path), :preserve => true
          end
          puts "done."
      end

    end
  end

end