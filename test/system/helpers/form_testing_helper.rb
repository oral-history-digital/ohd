# Generic form testing helper for system tests
# Enables testing any form by passing configuration for fields, values, and assertions
module FormTestingHelper
  # Fill and submit a form with configurable fields
  #
  # @param config [Hash] Configuration hash with:
  #   - :form_id or :form_selector [String] CSS selector for the form
  #   - :click_edit_button [Boolean] Whether to click Edit button first (default: true)
  #   - :edit_button_text [String] Text of the edit button (default: 'Edit')
  #   - :submit_button_text [String] Text of submit button (default: 'Submit')
  #   - :cancel_button_text [String] Text of cancel button (default: 'Cancel')
  #   - :in_modal [Boolean] Whether form is in a modal dialog (default: false)
  #   - :fields [Hash] Map of field name => config:
  #       - :value [String] Value to fill
  #       - :type [Symbol] :text, :rich_text, etc. (default: :text)
  #       - :index [Integer] For :rich_text, which editor instance (default: 0)
  #   - :ui_assertions [Array] Strings expected to appear in UI after save
  #   - :db_assertions [Hash] Field name => expected value for database verification
  #   - :db_model [Class] Model class for db_assertions (default: Project)
  #   - :db_lookup_field [Symbol] Field to use for lookup (default: :shortname)
  #   - :db_lookup_value [String] Value to search for (default: 'test')
  #   - :db_assertions_block [Proc] Block for custom database validation
  #
  # Example (with custom model):
  #   fill_and_verify_form(
  #     form_id: 'person',
  #     db_model: Person,
  #     db_lookup_field: :first_name,
  #     db_lookup_value: 'John',
  #     fields: { 'first_name' => { value: 'John' } },
  #     db_assertions: { 'first_name' => 'John' }
  #   )
  #
  # Example (form in modal):
  #   fill_and_verify_form(
  #     form_id: 'person',
  #     in_modal: true,
  #     click_edit_button: false,
  #     fields: { 'first_name' => { value: 'John' } },
  #     db_assertions: { 'first_name' => 'John' }
  #   )
  def fill_and_verify_form(config)
    form_selector = config[:form_id] ? "form##{config[:form_id]}" : config[:form_selector]
    should_click_edit = config.fetch(:click_edit_button, true)
    edit_button_text = config[:edit_button_text] || 'Edit'
    submit_button_text = config[:submit_button_text] || 'Submit'
    cancel_button_text = config[:cancel_button_text] || 'Cancel'
    in_modal = config.fetch(:in_modal, false)

    # Click the Edit button if needed
    if should_click_edit
      find('button', text: edit_button_text, match: :first).click
    end

    # Wait for modal if needed and scope searches to modal
    if in_modal
      modal = find('[data-reach-dialog-overlay]', visible: true, wait: 3)
      sleep 1  # Let modal fully render
      
      # Find form within modal
      form = within(modal) { find(form_selector, wait: 3) }
      within(modal) { find("#{form_selector} input", match: :first, wait: 2) }
    else
    # Wait for editable form to appear
    form = find(form_selector, wait: 3)
    find("#{form_selector} input", match: :first, wait: 2)
    end

    # Fill form fields
    within form do
      config[:fields].each do |field_name, field_config|
        fill_form_field(field_name, field_config)
      end

      # Submit the form
      click_on submit_button_text
    end

    # Wait for save to complete
    sleep 2

    # Verify UI assertions
    if config[:ui_assertions]
      config[:ui_assertions].each do |assertion_text|
        assert_text assertion_text
      end
    end

    # Verify database assertions
    if config[:db_assertions]
      db_model = config[:db_model] || Project
      db_lookup_field = config[:db_lookup_field] || :shortname
      db_lookup_value = config[:db_lookup_value] || 'test'
      verify_database_fields(config[:db_assertions], db_model, db_lookup_field, db_lookup_value)
    end

    if config[:db_assertions_block]
      instance_eval(&config[:db_assertions_block])
    end
  end

  # Fill a single form field based on its type
  #
  # @param field_name [String] Name of the field (e.g., 'name', 'introduction')
  # @param config [Hash] Field configuration:
  #   - :value [String] Value to fill
  #   - :type [Symbol] :text (default), :rich_text, :textarea
  #   - :index [Integer] For :rich_text, which editor (default: 0)
  def fill_form_field(field_name, config)
    value = config[:value]
    type = config[:type] || :text
    index = config[:index] || 0

    case type
    when :text
      fill_in field_name, with: value
    when :textarea
      fill_in field_name, with: value
    when :rich_text
      fill_in_draft_editor(value, index: index)    when :select
      select value, from: field_name    else
      raise ArgumentError, "Unknown field type: #{type}"
    end
  end

  # Fill a Draft.js rich text editor with real keyboard input
  #
  # @param text [String] Text to fill
  # @param index [Integer] Which editor instance (0 for first, etc.)
  def fill_in_draft_editor(text, index: 0)
    editor = all('.public-DraftEditor-content', wait: 5)[index]
    
    # Scroll into view and click to focus
    page.execute_script("arguments[0].scrollIntoView(true);", editor.native)
    editor.click
    
    # Wait for editor to be focused and ready
    sleep 0.5
    
    # Clear existing content multiple times to ensure it's truly empty
    # This is kind of haccky but necessary to prevent flaky tests in CI 
    # where the editor may not clear properly on first try
    3.times do
      editor.send_keys([:control, 'a'])
      sleep 0.1
      editor.send_keys(:backspace)
      sleep 0.1
    end
    
    # Critical: longer wait after clearing to ensure editor is ready for new input
    # This prevents the first character from being lost in slow CI environments
    sleep 2.0
    
    # Verify editor is ready by checking it can receive focus
    editor.click
    sleep 0.3
    
    # Type the first character separately to ensure editor is fully ready
    # This prevents the first character from being lost in CI
    if text.length > 0
      editor.send_keys(text[0])
      sleep 0.2
      editor.send_keys(text[1..-1]) if text.length > 1
    end
  end

  # Verify multiple database field values
  #
  # @param assertions [Hash] Map of field name => expected value
  # @param model_class [Class] Model class to query (default: Project)
  # @param lookup_field [Symbol] Field to use for lookup (default: :shortname)
  # @param lookup_value [String] Value to search for (default: 'test')
  def verify_database_fields(assertions, model_class = Project, lookup_field = :shortname, lookup_value = 'test')
    instance = model_class.find_by(lookup_field => lookup_value)
    raise "Could not find #{model_class} with #{lookup_field}=#{lookup_value}" unless instance

    assertions.each do |field_name, expected_value|
      actual_value = instance.send(field_name)
      assert_equal expected_value, actual_value, "#{field_name} should be #{expected_value.inspect}"
    end
  end

  # Verify that canceling form edits discards changes (no changes saved)
  #
  # @param config [Hash] Configuration:
  #   - :form_id or :form_selector [String] CSS selector for form
  #   - :model [Class] Model class to query (default: Project)
  #   - :lookup_field [Symbol] Field to use for lookup (default: :shortname)
  #   - :lookup_value [String] Value to search for (default: 'test')
  #   - :click_edit_button [Boolean] Whether to click Edit button first (default: true)
  #   - :edit_button_text [String] Text of edit button (default: 'Edit')
  #   - :cancel_button_text [String] Text of cancel button (default: 'Cancel')
  #   - :field_to_modify [String] Name of field to change (required)
  #   - :new_value [String] New value to try to fill (required)
  #   - :db_field_to_check [String] Field to verify wasn't changed (required)
  #
  # Example:
  #   verify_form_cancel(
  #     form_id: 'project',
  #     field_to_modify: 'name',
  #     new_value: 'Updated Name',
  #     db_field_to_check: 'name'
  #   )
  def verify_form_cancel(config)
    form_selector = config[:form_id] ? "form##{config[:form_id]}" : config[:form_selector]
    should_click_edit = config.fetch(:click_edit_button, true)
    edit_button_text = config[:edit_button_text] || 'Edit'
    cancel_button_text = config[:cancel_button_text] || 'Cancel'
    model = config[:model] || Project
    lookup_field = config[:lookup_field] || :shortname
    lookup_value = config[:lookup_value] || 'test'

    # Get original value before making changes
    instance = model.find_by(lookup_field => lookup_value)
    original_value = instance.send(config[:db_field_to_check])

    # Click the Edit button if needed
    if should_click_edit
      find('button', text: edit_button_text, match: :first).click
    end

    # Wait for editable form to appear
    form = find(form_selector, wait: 3)
    find("#{form_selector} input", match: :first, wait: 2)

    # Make a change and then cancel
    within form do
      fill_in config[:field_to_modify], with: config[:new_value]
      click_on cancel_button_text
    end

    # Wait for form to close
    sleep 1

    # Verify change was not saved
    instance.reload
    actual_value = instance.send(config[:db_field_to_check])
    assert_equal original_value, actual_value, "#{config[:db_field_to_check]} should not have changed"
  end
end
