module ZWAR

  module TagExtension

    def self.included(base)
      base.class_eval <<SCOPE
        named_scope :for_user, lambda{|user|
          {
                  :joins =>  'LEFT JOIN taggings ON taggings.tag_id = tags.id LEFT JOIN user_contents ON user_contents.id = taggings.taggable_id',
                  :conditions => ['user_contents.user_id = ?', user.id],
                  :select => "DISTINCT tags.*"
          }
        }
SCOPE
    end

  end
end