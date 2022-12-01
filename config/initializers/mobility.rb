Mobility.configure do

  # PLUGINS
  plugins do
    backend :table

    active_record

    reader
    writer
    fallbacks
    locale_accessors
  end
end
