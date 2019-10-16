class RemoveMiddleDutchLangCode < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :campscapes
      Language.find_by_code('dum').try(:destroy)
    end
  end
end
