require 'test_helper'

class ConfirmationsControllerTest < ActionController::TestCase
  setup do
    @request.host = 'test.portal.oral-history.localhost'
    @user = Struct.new(:default_locale, :pre_register_location).new('de', nil)
  end

  test 'confirmation returns to the originating search with its filters' do
    @user.pre_register_location = 'http://test.portal.oral-history.localhost:47001/en/searches/archive?sort=random'

    assert_equal @user.pre_register_location, confirmation_return_path
  end

  test 'relative return paths preserve filters and remove internal flags tokens and fragments' do
    @user.pre_register_location = '/de/searches/archive?sort=random&checked_ohd_session=true&access_token=old&confirmation_token=old&reset_password_token=old#fragment'

    assert_equal '/de/searches/archive?sort=random', confirmation_return_path
  end

  test 'trusted project domains preserve filters without authentication parameters' do
    Project.find_by!(shortname: 'test').update!(archive_domain: 'https://archive.example')
    @user.pre_register_location = 'https://archive.example/test/de/searches/archive?sort=random&checked_ohd_session=true&access_token=old#fragment'

    assert_equal 'https://archive.example/test/de/searches/archive?sort=random', confirmation_return_path
  end

  test 'untrusted hosts unsafe schemes and embedded credentials fall back to the user locale' do
    [
      'https://untrusted.example/de/searches/archive?sort=random',
      '//untrusted.example/de/searches/archive',
      'javascript:/de/searches/archive',
      'http:/untrusted.example/de/searches/archive',
      'ftp://test.portal.oral-history.localhost/de/searches/archive',
      'https://name:password@test.portal.oral-history.localhost/de/searches/archive',
      'http://[invalid',
      'relative/path',
    ].each do |path|
      @user.pre_register_location = path
      assert_equal '/de', confirmation_return_path, path
    end
  end

  test 'empty and malformed query return paths fall back without raising' do
    [nil, '', '/de/searches/archive?filter=x&filter[name]=y', '/de/searches/archive?sort=%ZZ',
      "/de/searches/archive?filter#{'[name]' * 40}=value"].each do |path|
      @user.pre_register_location = path
      assert_equal '/de', confirmation_return_path
    end
  end

  test 'a return path with only internal parameters has no empty query string' do
    @user.pre_register_location = '/de/searches/archive?checked_ohd_session=true&access_token=old'

    assert_equal '/de/searches/archive', confirmation_return_path
  end

  private

  def confirmation_return_path
    @controller.send(:after_confirmation_path_for, :user, @user)
  end
end
