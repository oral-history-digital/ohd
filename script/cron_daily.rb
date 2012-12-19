#!/opt/ruby-enterprise-1.8.7-2010.02/bin/ruby

File.open("/tmp/hello.txt", "w") { |fp| fp.puts "Hello, world" }

