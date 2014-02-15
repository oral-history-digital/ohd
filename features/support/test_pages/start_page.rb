module TestPages
  class StartPage < Page
    def initialize
      create :interview, :archive_id => 'za465'
    end

    def path
      '/'
    end
  end
end
