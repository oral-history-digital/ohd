require "digest/sha1"

module Devise
  module Encryptors
    # = Sha1
    # Uses the Sha1 hash algorithm to encrypt passwords.
    class FuDis < Base
      
      # Gererates a default password digest based on stretches, salt, pepper and the
      # incoming password.
      def self.digest(password, stretches, salt, pepper)
        # ignore stretches and pepper
        salted_password = password + salt
        digest = Digest::SHA1.digest(salted_password)
        Base64.encode64(digest + salt).chomp
      end

    end
  end
end