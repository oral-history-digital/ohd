require "digest/sha1"

module Devise
  module Encryptors
    class Archive < Base
      
      # Gererates a default password digest based on stretches, salt, pepper and the
      # incoming password.
      def self.digest(password, stretches, salt, pepper)
        salt_decoded = Base64.decode64(salt)
        # ignore stretches and pepper
        salted_password = password + salt_decoded
        digest = Digest::SHA1.digest(salted_password)
        Base64.encode64(digest + salt_decoded).chomp
      end

    end
  end
end