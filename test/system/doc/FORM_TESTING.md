# Form Testing Helpers

Generic form testing. See the actual helper files for full method documentation.

## Quick Start

### 1. Discover form fields

Add to any test or run interactively:

```ruby
require "application_system_test_case"

class FormFieldsDiscoveryTest < ApplicationSystemTestCase
  test 'discover archive form fields' do
    visit '/'
    login_as 'alice@example.com'

    click_on 'Editing interface'
    click_on 'Archive configuration'
    click_on 'Edit archive information'

    # Click Edit button to enter edit mode
    find('button', text: 'Edit', match: :first).click
    sleep 1

    # Print all available fields in test-ready format
    # Pass model_class so db_assertions show correct types (integer vs string, etc.)
    print_form_fields('form#project', include_all_details: true, model_class: Project)

    # Just verify we can get the form (don't modify anything)
    assert_selector 'form#project'
  end
end
```

Run with: `bin/rails test test/system/form_fields_discovery_test.rb`

Output will be copy-paste-ready test code.

### 2. Copy output and customize for your test

```ruby
fill_and_verify_form(
  form_id: 'my_form',
  fields: {
    'name' => { value: 'Updated Name' },
    'intro' => { value: 'Content', type: :rich_text, index: 0 },
  },
  ui_assertions: ['Updated Name'],
  db_assertions: { 'name' => 'Updated Name' }
)
```

## Field Types

- `:text` (default) - Text input
- `:textarea` - Multi-line text
- `:rich_text` - Draft.js editor (requires `index`)
    - **Note**: Database stores as HTML: `'text'` → `'<p>text</p>'`

## Methods

**`fill_and_verify_form(config)`**

- Fill form, submit, verify UI and database
- Works with any model via:
    - `db_assertions: { field: value }` - Uses default Project/shortname lookup
    - `db_assertions_block: proc { ... }` - Custom validation for any model

**`verify_form_cancel(config)`**

- Verify cancel button discards changes
- Default: Project with shortname='test' lookup
- For other models:
    ```ruby
    verify_form_cancel(
      form_id: 'my_form',
      model: MyModel,
      lookup_field: :id,
      lookup_value: @record.id,
      field_to_modify: 'name',
      new_value: 'Changed',
      db_field_to_check: 'name'
    )
    ```

**`print_form_fields(selector, include_all_details: false, model_class: nil)`** - Print all fields in test-ready format

## Options

- `click_edit_button` (default: `true`) - Skip Edit button if form is already editable
- `in_modal` (default: `false`) - Wait for modal to be visible before interacting with form
- `form_id: 'id'` or `form_selector: 'selector'` - Form identifier
- `db_model` (default: `Project`) - Model class for database assertions
- `db_lookup_field` (default: `:shortname`) - Field used to find record (e.g., `:first_name`, `:id`)
- `db_lookup_value` (default: `'test'`) - Value to search for
- `db_assertions_block: proc { ... }` - Custom database validation

## Examples

### No Edit Button

```ruby
fill_and_verify_form(
  form_id: 'quick_form',
  click_edit_button: false,
  fields: { 'title' => { value: 'New' } }
)
```

### Form in Modal

```ruby
fill_and_verify_form(
  form_id: 'person',
  in_modal: true,
  click_edit_button: false,  # Already opened the modal in test
  fields: {
    'first_name' => { value: 'John' },
    'last_name' => { value: 'Doe' }
  },
  db_model: Person,
  db_lookup_field: :first_name,
  db_lookup_value: 'John',
  db_assertions: {
    'first_name' => 'John',
    'last_name' => 'Doe'
  }
)
```

### Testing a Different Model

```ruby
interview = create(:interview)

fill_and_verify_form(
  form_selector: 'form.interview_form',
  click_edit_button: false,
  fields: {
    'title' => { value: 'New Interview Title' },
    'description' => { value: 'Updated description', type: :rich_text, index: 0 }
  },
  db_assertions: { 'title' => 'New Interview Title' },
  db_assertions_block: proc do
    interview.reload
    assert interview.description.starts_with?('<p>')
  end
)

# Also test cancel with a different model
verify_form_cancel(
  form_id: 'interview_form',
  model: Interview,
  lookup_field: :id,
  lookup_value: interview.id,
  field_to_modify: 'title',
  new_value: 'Should Not Save',
  db_field_to_check: 'title'
)
```
