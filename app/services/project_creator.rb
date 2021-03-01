class ProjectCreator
  attr_accessor :shortname, :aspect_x, :aspect_y,
    :archive_id_number_length, :initials, :project

  def initialize(shortname: '', initials: '', aspect_x: 16, aspect_y: 9, archive_id_number_length: 3)
    @shortname = shortname
    @initials = initials
    @aspect_x = aspect_x
    @aspect_y = aspect_y
    @archive_id_number_length = @archive_id_number_length
  end

  def build
    @project = Project.new(
      shortname: shortname,
      initials: initials,
      aspect_x: aspect_x,
      aspect_y: aspect_y,
      archive_id_number_length: archive_id_number_length
    )
    project
  end

  def create_root_registry_entry
    root = RegistryEntry.create(code: 'root', workflow_state: 'public')
    RegistryEntryProject.create(project_id: project.id, registry_entry_id: root.id)
  end

  def create
    build
    project.save
    create_root_registry_entry
  end
end
