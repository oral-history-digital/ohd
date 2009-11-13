require 'zwar_archive'

ActiveRecord::Base.send :include, ZWAR::CategoryExtension
