class TransformPersonNameSearches < ActiveRecord::Migration
  def self.up
    Search.all(:conditions => "properties like '%person_name:%'").each do |uc|
      properties = uc.properties
      person_name = properties['query'].delete('person_name')
      interviews = Interview.all(:select => 'DISTINCT interviews.id', :joins => :translations, :conditions => {:interview_translations => {:full_title => person_name}})
      raise "Did not find interview for person_name: #{person_name}" if interviews.blank?
      properties['query']['interview_id'] = interviews.map(&:id)
      uc.properties = properties
      uc.save!
    end
  end

  def self.down
    Search.all(:conditions => "properties like '%interview_id:%'").each do |uc|
      properties = uc.properties
      interview_id = properties['query'].delete('interview_id').first.to_i
      interview = Interview.find(interview_id)
      raise "Did not find person_name for interview: #{interview_ids.first}" if interview.blank?
      properties['query']['person_name'] = interview.full_title(:de)
      uc.properties = properties
      uc.save!
    end
  end
end
