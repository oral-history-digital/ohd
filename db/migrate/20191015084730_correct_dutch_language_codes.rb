class CorrectDutchLanguageCodes < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :campscapes
      Language.find_by_code('dum/eng').try(:update, {code: 'dut/eng', name: 'Dutch and English'} )
      Language.find_by_code('dum').interviews.map{ |i| i.update(language_id: Language.find_by_code('dut').id) }
    end
  end
end
