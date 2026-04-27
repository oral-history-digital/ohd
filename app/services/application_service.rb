class ApplicationService
  def self.perform(*args, **kwargs, &block)
    new(*args, **kwargs, &block).perform
  end
end
