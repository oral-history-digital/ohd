#!bin/rails runner
require 'open-uri'

ActiveStorage::Attachment.find_each do |attachment|
  name = attachment.name

  source = attachment.record.send(name).path
  dest_dir = File.join(
    "/mnt/vfiler11.campus.fu-berlin.de/cedis_stream04_da/mog/storage",
    attachment.blob.key.first(2),
    attachment.blob.key.first(4).last(2))
  dest = File.join(dest_dir, attachment.blob.key)

  FileUtils.mkdir_p(dest_dir)

  puts "Moving #{source} to #{dest}"

  # FileUtils.cp(source, dest)

  File.open(dest, 'wb') do |fo|
    fo.write open(source).read
  end
end