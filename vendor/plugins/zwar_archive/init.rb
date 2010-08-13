require 'zwar_archive'

#require 'sunspot/media_id_adapter'

ActiveRecord::Base.send :include, ZWAR::CategoryExtension
