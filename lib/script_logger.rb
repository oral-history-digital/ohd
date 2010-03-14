class ScriptLogger

  LOG_DIR = File.join(File.dirname(__FILE__), '../log')

  def initialize(name)
    @log_file = File.join(LOG_DIR, name.to_s + Time.now.strftime('-%d.%m.%Y-%Hh%M.log'))
    File.open(@log_file,"a"){|f|}
  end

  def log(msg)
    system "echo '[#{Time.now.strftime('%d.%m.%Y %H:%M')}] #{msg.sub(/\n$/,'')}' >> #{@log_file}"
    puts msg
  end

end
