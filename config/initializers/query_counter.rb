if Rails.env.development?
  class MyLogger < ActiveSupport::Logger
    def initialize(*args)
      @counter = 0

      super
    end

    def format_message(severity, datetime, progname, msg)
      @counter += 1

      super
    end

    def reset_query_count
      @counter = 0
    end

    def query_count
      "#{@counter} queries performed"
    end
  end

  ActiveRecord::Base.logger = MyLogger.new(STDOUT)
end