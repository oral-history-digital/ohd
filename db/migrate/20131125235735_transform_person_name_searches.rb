# This migration requires a fully up-to-date solr index!
class TransformPersonNameSearches < ActiveRecord::Migration
  def self.up
    Search.all(:conditions => "properties like '%person_name:%'").each do |uc|
      properties = uc.properties
      person_name = properties['query'].delete('person_name')
      next if person_name.blank?
      interviews = Search.instance_eval do |search_class|
                     build_unfiltered_interview_query(1) do
                       with(:"person_name_#{I18n.locale}").any_of person_name
                     end.
                     execute!.
                     results
                   end
      if interviews.size != 1
        say "Did not find unique interview for person_name: #{person_name}"
        next
      end
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
