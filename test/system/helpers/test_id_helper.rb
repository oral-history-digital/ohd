  def click_test_id(test_id)
    find("[data-testid=\"#{test_id}\"]").click
  end

  def find_test_id(test_id)
    find("[data-testid=\"#{test_id}\"]")
  end

  def fill_in_test_id(test_id, with:)
    find_test_id(test_id).fill_in(with: with)
  end

  def select_test_id_option(test_id, option_text)
    find_test_id(test_id).find('option', text: option_text).select_option
  end

  def assert_test_id_text(test_id, text)
    within find_test_id(test_id) do
      assert_text text
    end
  end

  def assert_test_id_button_state(test_id, disabled: false)
    button = find_test_id(test_id)
    if disabled
      assert button.disabled?, "Expected button with test id '#{test_id}' to be disabled"
    else
      assert_not button.disabled?, "Expected button with test id '#{test_id}' to be enabled"
    end
  end