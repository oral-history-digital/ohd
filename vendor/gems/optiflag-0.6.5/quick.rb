require 'optiflag'

module DBChecker extend OptiFlagSet(:flag_symbol => "/")
  flag "log"
  flag "password"
  flag "user"

  and_process!
end 
puts "The user's user name is #{ DBChecker.flags.user }"
puts "The user's password is #{ DBChecker.flags.password }"
puts "The log directory is #{ DBChecker.flags.log }"
