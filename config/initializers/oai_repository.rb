OaiRepository.setup do |config|

  config.repository_name = 'Oral History Digital'

  # The URL from which this OAI Repository is served.
  # If you're deploying to different hostnames (e.g. development, QA and
  # production environments, each with different hostnames), you could
  # dynamically set this.
  config.repository_url = Rails.env.development? ? "http://portal.oral-history.localhost:3000" : "https://portal.oral-history.digital"

  # By default the (unique) identifier of each record will be composed as
  # #{record_prefix}/#{record.id}
  # This is probably not want you want, especially if you have multiple record
  # sets (i.e. this provider serves multiple ActiveRecord models)
  #
  # Most probably you'll create an oai_dc_identifier attribute or method in
  # the AR models you intend to serve. That value will supplant the default.
  config.record_prefix = 'OHD'

  # This is your repository administrator's email address.
  # This will appear in the information returned from an "Identify" call to
  # your repository
  config.admin_email = "herdis.kley@cedis.fu-berlin.de"

  # The number of records shown at a time (when doing a ListRecords)
  config.limit = 10000

  # The values for "models" should be the class name of the ActiveRecord model 
  # class that is being identified with the given set. It doesn't actually have
  # to be a ActiveRecord model class, but it should act like one.
  #
  # You must supply at least one model.
  # TODO: reuse the following line after having run project-migrations
  # and created a project
  config.models = [ 'Interview', 'Project' ]

  # List the sets (and the ActiveRecord model they belong to). E.g.
  #
  # config.sets = [
  #   {
  #     spec: 'class:party',
  #     name: 'Parties',
  #     model: Person
  #   },
  #   {
  #     spec: 'class:service',
  #     name: 'Services',
  #     model: Instrument,
  #     description: 'Things that are services'
  #   }
  # ]
  #
  config.sets = [
     {
       spec: 'class:interview',
       name: 'Interviews',
       model: 'Interview',
       description: 'Interviews'
     },
     {
       spec: 'class:project',
       name: 'Archive',
       model: 'Project',
       description: 'Archive'
     }
  ]

  # By default, an OAI repository must emit its records in OAI_DC (Dublin Core)
  # format. If you want to provide other output formats for your repository
  # (and those formats are subclasses of OAI::Provider::Metadata.Format) then
  # you can specify them here. E.g.
  #
  # require 'rifcs_format'
  #
  # config.additional_formats = [
  #   OAI::Provider::Metadata::RIFCS
  # ]
  config.additional_formats = []

end
