#!/opt/ruby-enterprise-1.8.7-2010.02/bin/ruby

require 'rubygems'
require 'open4'

class SimpleScriptLogger

  LOG_FILE = File.join(File.dirname(__FILE__), '../log', "cron-error.log")

  def initialize
    File.open(LOG_FILE,"a"){|f|}
  end

  def log(msg)
    system "echo '[#{Time.now.strftime('%d.%m.%Y %H:%M')}]#{msg.gsub("'","")}' >> #{LOG_FILE}"
    puts msg
  end

end

@logger = SimpleScriptLogger.new


def run_as_process(name, call)
  begin
    Open4::popen4("cd #{File.join(File.dirname(__FILE__),'..')} && #{call}") do |pid, stdin, stdout, stderr|
      stdout.each_line {|line| puts line}
      errors = []
      stderr.each_line {|line| errors << line unless line.empty?}
      @logger.log "\n#{name} - FEHLER:\n#{errors.join("")}" unless errors.empty?
    end
  rescue Exception => e
    @logger.log "\n#{name} - ABORTED: #{e.message}\n#{e.respond_to?('backtrace') ? (e.backtrace || '') : ''}"
    STDOUT.flush
  end
end

# Import up to 50 interviews
run_as_process 'Datenimport', 'rake xml_import:limited number=50 -t'

