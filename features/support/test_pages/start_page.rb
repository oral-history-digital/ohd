class TestPages::StartPage < TestPages::ApplicationPage
  def initialize
    still = File.new("#{CeDiS.config.cifs_share}archiv_backup/bilder/interview_stills/za465.JPG")

    # First create the interview that is hard coded to the start page
    # while logged out.
    # NB: Make sure that the database test entry matches the solr index entry.
    search = Search.from_params('partial_person_name' => 'baschlai').search!
    fixed_int_id = search.hits.first.primary_key.to_i
    fixed_int_id.should > 0
    create :interview, :id => fixed_int_id, :researched => true, :still_image => still

    # Now create a few more interviews so that we can test the name search.
    # We need at least 13 hits (i.e. two pages à 12 hits).
    search1 = Search.from_params({'page' => 1}).search!
    search2 = Search.from_params({'page' => 2}).search!
    (search1.hits + search2.hits)[0..13].each_with_index do |hit, index|
      interview_id = hit.primary_key.to_i
      next if interview_id == fixed_int_id
      interview_id.should > 0
      create :interview, :id => interview_id, :archive_id => "za#{index.to_s.rjust(3, '0')}",
             :last_name => "Last#{index}", :first_name => "First#{index}", :other_first_names => "Other#{index}",
             :still_image => still
    end
  end

  def path
    '/'
  end

  def login_link
    'Anmelden'
  end

  def successful_login_message
    'Sie sind jetzt angemeldet.'
  end

  def enter_part_of_an_interviewee_name_into_the_name_search_box
    fill_autocomplete 'search_person_name', :select => 'Baschlai', :with => 'ba'
  end

  def desired_interviewee_name_element
    "li.ui-menu-item a:contains('Baschlai')"
  end

  def autocomplete_result_list_element
    'ul.ui-autocomplete'
  end
end
