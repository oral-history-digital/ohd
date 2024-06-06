class DestroyDefaultExternalLinks < ActiveRecord::Migration[7.0]
  def up
    ExternalLink.where(internal_name: %w(conditions privacy_protection legal_info contact)).destroy_all
  end
end
