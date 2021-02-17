class MoveMediaStreamsToDb < ActiveRecord::Migration[5.2]
  def up
    create_table :media_streams do |t|
      t.integer :project_id
      t.string :resolution
      t.string :path
      t.string :media_type
      t.timestamps
    end

    %w(video audio).each do |media_type|
      Project.media_streams[media_type] && Project.media_streams[media_type].each do |resolution, path|
        MediaStream.create project_id: Project.first.id, resolution: resolution, path: path, media_type: media_type
      end
    end
  end

  def down
    drop_table :media_streams
  end

end
