class CorrectSpanishLanguageCodes < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :campscapes
      Language.find_by_code("spa/yid").try(:update, { name: "Spanish and Yiddish" })
    end
  end
end
