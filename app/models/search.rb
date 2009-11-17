class Search < ActiveRecord::Base

  def self.from_params(query_params=nil)
    Search.new
  end

end