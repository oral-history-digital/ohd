# Be sure to restart your server when you modify this file.

# Use cache_store because of logout bug:
# https://projects.fu-berlin.de/browse/INTARCH-1684
Rails.application.config.session_store :cache_store, key: '_archive_session'
