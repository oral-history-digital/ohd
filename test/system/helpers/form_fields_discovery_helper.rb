# Debug helper for discovering form fields during test development
# Print all available form fields in a format ready to include in tests
module FormFieldsDiscoveryHelper
  # Print all available form fields with copy-paste-ready test configuration
  #
  # Call this in a test after navigating to the form (and clicking Edit if needed)
  # to discover all available fields and their types.
  #
  # @param form_selector [String] CSS selector for the form (e.g., 'form#project')
  # @param include_all_details [Boolean] Show additional field details (default: false)
  # @param model_class [Class] Model class for type introspection (default: Project)
  #
  # Example in test:
  #   find('button', text: 'Edit', match: :first).click
  #   sleep 1
  #   print_form_fields('form#project', include_all_details: true, model_class: Project)
  def print_form_fields(form_selector, include_all_details: false, model_class: Project)
    form = find(form_selector, wait: 3)

    puts "\n\n" + "=" * 70
    puts "FORM FIELDS FOR: #{form_selector}"
    puts "=" * 70 + "\n"

    # Collect all fields
    fields_info = {}

    # 1. Text inputs (excluding submit buttons, etc.)
    form.all('input').each do |input|
      next if input['type'].to_s.match?(/submit|button|hidden/)

      field_name = input['name'] || input['id']
      next unless field_name

      fields_info[field_name] = {
        type: :text,
        element: input,
        value: input.value
      }
    end

    # 2. Textareas
    form.all('textarea').each do |textarea|
      field_name = textarea['name'] || textarea['id']
      next unless field_name

      fields_info[field_name] = {
        type: :textarea,
        element: textarea,
        value: textarea.value
      }
    end

    # 3. Rich text editors (Draft.js)
    rich_text_editors = form.all('.public-DraftEditor-content')
    rich_text_editors.each_with_index do |editor, index|
      label_text = find_editor_label(editor)
      field_label = label_text || "rich_text_field_#{index}"
      fields_info[field_label] = {
        type: :rich_text,
        element: editor,
        index: index,
        current_value: editor.text
      }
    end

    # 4. Select fields (filter out rich text toolbar dropdowns)
    form.all('select').each do |select|
      parent_text = select.find(:xpath, '..').text rescue ''
      next if parent_text.include?('Normal')

      field_name = select['name'] || select['id']
      next unless field_name

      fields_info[field_name] = {
        type: :select,
        element: select,
        options: select.all('option').map(&:text),
        current_value: select.value
      }
    end

    # Print output in test-ready format
    print_test_ready_config(fields_info, form_selector, model_class)

    # Print detailed field information if requested
    if include_all_details
      print_detailed_info(fields_info)
    end

    puts "=" * 70 + "\n\n"
  end

  private

  # Helper to find label associated with a rich text editor
  def find_editor_label(editor)
    begin
      label_element = editor.find(:xpath, "ancestor::*[1]//preceding::label[1]", visible: :all)
      return label_element.text if label_element
    rescue Capybara::ElementNotFound
      # Try alternate approach
    end

    begin
      label_element = editor.find(:xpath, "ancestor::*/preceding-sibling::label[1]", visible: :all)
      return label_element.text if label_element
    rescue Capybara::ElementNotFound
      nil
    end
  end

  # Print fields in fill_and_verify_form() config format
  def print_test_ready_config(fields_info, form_selector, model_class = Project)
    puts "# Copy-paste into fill_and_verify_form() config:\n\n"
    puts "fill_and_verify_form("
    puts "  form_id: '#{form_selector.sub('form#', '')}',  # or form_selector: '#{form_selector}'"
    puts "  fields: {"

    fields_info.each do |field_name, info|
      type = info[:type]
      case type
      when :text, :textarea
        puts "    '#{field_name}' => { value: 'New value', type: :#{type} },"
      when :rich_text
        puts "    '#{field_name}' => { value: 'New content', type: :rich_text, index: #{info[:index]} },"
      when :select
        options = info[:options].join(', ')
        puts "    '#{field_name}' => { value: 'option_value', type: :select },  # options: #{options}"
      end
    end

    puts "  },"
    puts "  ui_assertions: ["
    puts "    # Add expected UI text after save"
    puts "  ],"
    puts "  db_assertions: {"
    fields_info.each do |field_name, info|
      # Get the column type from the model to show correct format
      db_type = get_column_type(model_class, field_name)
      current_val = info[:value] || info[:current_value] || ""
      
      case db_type
      when :integer
        # Show as integer with a comment
        puts "    '#{field_name}' => 5,  # Change to your test value"
      when :text, :string
        puts "    '#{field_name}' => 'Changed value',"
      when :date, :datetime
        puts "    '#{field_name}' => '2026-03-15',"
      else
        puts "    '#{field_name}' => #{current_val.inspect},"
      end
    end
    puts "  }"
    puts ")\n\n"
  end

  private

  # Get the column type from the model
  def get_column_type(model_class, field_name)
    column = model_class.columns_hash[field_name]
    return column.type if column
    nil
  end

  # Print detailed field information
  def print_detailed_info(fields_info)
    puts "=" * 70
    puts "DETAILED FIELD INFORMATION"
    puts "=" * 70 + "\n"

    fields_info.each do |field_name, info|
      puts "Field: #{field_name}"
      puts "  Type: #{info[:type]}"
      case info[:type]
      when :text, :textarea
        puts "  Current value: #{info[:value].inspect}"
      when :rich_text
        puts "  Index: #{info[:index]}"
        puts "  Current content: #{info[:current_value].inspect}"
      when :select
        puts "  Options: #{info[:options].join(', ')}"
        puts "  Current value: #{info[:current_value].inspect}"
      end
      puts ""
    end
  end
end