# ActiveStorage mounts POST /rails/active_storage/direct_uploads without any
# authentication. Nothing in this application uses direct uploads, and leaving
# the route open lets anyone create a blob with arbitrary content and then push
# it through the variant pipeline via a representation URL.
class BlockDirectUploads
  PATH = "/rails/active_storage/direct_uploads"

  def initialize(app)
    @app = app
  end

  def call(env)
    return [404, { "content-type" => "text/plain" }, ["Not Found"]] if env["PATH_INFO"] == PATH

    @app.call(env)
  end
end

Rails.application.config.middleware.insert_before 0, BlockDirectUploads
