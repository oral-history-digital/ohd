# Be sure to restart your server when you modify this file.

# Add new mime types for use in respond_to blocks:
# Mime::Type.register "text/richtext", :rtf
Mime::Type.register "text/vtt", :vtt
Mime::Type.register "application/vnd.oasis.opendocument.spreadsheet", :ods
Mime::Type.register "application/pdf", :pdf, ['text/pdf'], ['pdf']
Mime::Type.register "application/zip", :zip
Mime::Type.register "application/data", :key
