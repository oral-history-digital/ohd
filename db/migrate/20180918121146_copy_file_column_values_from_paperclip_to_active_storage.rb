Dir[Rails.root.join("app/models/**/*.rb")].sort.each { |file| require file }

class CopyFileColumnValuesFromPaperclipToActiveStorage < ActiveRecord::Migration[5.2]
  require 'open-uri'

  def up
    # postgres
    # get_blob_id = 'LASTVAL()'
    # mariadb
    get_blob_id = 'LAST_INSERT_ID()'
    # sqlite
    # get_blob_id = 'LAST_INSERT_ROWID()'

    active_storage_blob_statement = ActiveRecord::Base.connection.raw_connection.prepare(<<-SQL)
      INSERT INTO active_storage_blobs (
        `key`, filename, content_type, metadata, byte_size, checksum, created_at
      ) VALUES (?, ?, ?, '{}', ?, ?, ?)
    SQL

    active_storage_attachment_statement = ActiveRecord::Base.connection.raw_connection.prepare(<<-SQL)
      INSERT INTO active_storage_attachments (
        name, record_type, record_id, blob_id, created_at
      ) VALUES (?, ?, ?, #{get_blob_id}, ?)
    SQL

    #models = ActiveRecord::Base.descendants.reject(&:abstract_class?)
    models = [Photo, Interview, TextMaterial]

    transaction do
      models.each do |model|
        attachments = model.column_names.map do |c|
          if c =~ /(.+)_file_name$/
            $1
          end
        end.compact

        if attachments.length > 0
          model.find_each.each do |instance|
            attachments.each do |attachment|
              if !instance.send("#{attachment}_file_name").blank?
                active_storage_blob_statement.execute(
                  key(instance, attachment),
                  instance.send("#{attachment}_file_name"),
                  instance.send("#{attachment}_content_type"),
                  instance.send("#{attachment}_file_size"),
                  checksum(instance, attachment),
                  DateTime.now
                )

                active_storage_attachment_statement.
                  execute(attachment, model.name, instance.id, DateTime.now)
              end
            end
          end
        end
      end
    end

    active_storage_attachment_statement.close
    active_storage_blob_statement.close
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end

  private

  def key(instance, attachment)
    SecureRandom.uuid
    # Alternatively:
    # instance.send("#{attachment}_file_name")
  end

  def checksum(instance, attachment)
  #def checksum(attachment)
    # local files stored on disk:
    #url = attachment.path
    #Digest::MD5.base64digest(File.read(url))

    # remote files stored on another person's computer:
    #url = attachment.url
    #Digest::MD5.base64digest(Net::HTTP.get(URI(url)))

    # zwar:
    if Project.name.to_sym != :mog
      p = instance.send("#{attachment}_file_name").split('.')
      url = 'https://medien.cedis.fu-berlin.de/zwar/gallery/' + p[0] + '_original.' + p[1]
      Digest::MD5.base64digest(Net::HTTP.get(URI(url)))
    #elsif Project.name.to_sym == :mog
    else
      # in mog image-files are not named like in zwar!!
      # they should be renamed and moved for unification when leaving dedalo
      raise "fit file url to mog or whatever"
    end
  end
end
