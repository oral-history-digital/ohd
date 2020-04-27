class RenameProjectRgbColorColumns < ActiveRecord::Migration[5.2]
  def change
    remove_column :projects, :primary_color_rgb
    add_column :projects, :primary_color, :string
    add_column :projects, :secondary_color, :string

    reversible do |dir|

      dir.up do
        primary_colors = {
          mog: '#006fb7',
          zwar: '#8f201c',
          cdoh: '#006169',
          campscapes: '#730033',
          dg: '#006fb7'
        }

        secondary_colors = {
          mog: '#d6c537',
          zwar: '#8f201c',
          cdoh: '#efae0f',
          campscapes: '#021E62',
          dg: '#006fb7'
        }

        %w(mog zwar cdoh campscapes dg).each do |shortname|
          project = Project.where("lower(shortname) = ?", shortname).first
          project && project.update_attributes(primary_color: primary_colors[shortname.to_sym], secondary_color: secondary_colors[shortname.to_sym])
        end
      end
      dir.down do
      end
    end
  end
end
