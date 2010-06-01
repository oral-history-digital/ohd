require "digest/sha1"

module Devise
  module Encryptors
    class Archive < Base
      
      # Gererates a default password digest based on stretches, salt, pepper and the
      # incoming password.
      def self.digest(password, stretches, salt, pepper)
        puts "\n\n@@@ CALLING FU-DIS ENCRYPTOR: #{password}, #{salt}"
        # ignore stretches and pepper
        salted_password = password + salt
        digest = Digest::SHA1.digest(salted_password)
        puts "digest: #{digest}\n@@@@\n"
        Base64.encode64(digest + salt).chomp
      end

    end
  end
end