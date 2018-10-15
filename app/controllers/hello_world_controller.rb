# frozen_string_literal: true

class HelloWorldController < BaseController
  layout "hello_world"

  def index
    @hello_world_props = { name: "Stranger" }
  end
end
