# Forms Module

The forms module provides flexible, accessible form components with support for complex layouts, validation, and field grouping.

## Table of Contents

- [Element Grouping](#element-grouping)
- [Usage Examples](#usage-examples)
- [Confirm form submission](#confirm-form-submission)
- [CSS Layout Control](#css-layout-control)

## Element Grouping

Form elements can be organized into groups to control their layout and visual presentation. The `group` property allows you to group related fields together, which are then wrapped in a `form-row` container.

### How It Works

When you define a `group` property on form elements, the form module automatically:

1. **Collects related elements** - All elements with the same group name are gathered together
2. **Maintains order** - Groups appear in the order they first appear in the elements array
3. **Wraps in containers** - Each group gets its own `<div class="form-row form-row--{groupName}">` container
4. **Handles ungrouped elements** - Elements without a group get individual `form-row` containers with semantic names like `single-email`, `single-country`

### Element Configuration

Each element can have the following layout-related properties:

```javascript
{
    attribute: 'first_name',        // Field name
    group: 'personal',              // Optional: group identifier for layout
    elementType: 'input',           // Type of input component
    type: 'text',                   // HTML input type
    // ... other element properties
}
```

- **group** (string, optional): Identifier for grouping elements. Elements with the same group name will be rendered in the same `form-row` container. If not specified, the element gets its own container.

## Usage Examples

### Example 1: Simple Two-Column Layout

Group first and last names side-by-side:

```javascript
const elements = [
    {
        attribute: 'first_name',
        group: 'name',
        elementType: 'input',
        type: 'text',
    },
    {
        attribute: 'last_name',
        group: 'name',
        elementType: 'input',
        type: 'text',
    },
    {
        attribute: 'email',
        elementType: 'input',
        type: 'email',
    },
];
```

HTML output:

```html
<div class="form-row form-row--name">
    <div class="form-group"><!-- first_name input --></div>
    <div class="form-group"><!-- last_name input --></div>
</div>
<div class="form-row form-row--single-email">
    <div class="form-group"><!-- email input --></div>
</div>
```

### Example 2: Complex Address Form

Group address fields with different layouts:

```javascript
const elements = [
    // Personal information - full width
    {
        attribute: 'first_name',
        group: 'personal',
        elementType: 'input',
        type: 'text',
    },
    {
        attribute: 'last_name',
        group: 'personal',
        elementType: 'input',
        type: 'text',
    },

    // Address - street full width, city and zipcode side-by-side
    {
        attribute: 'street',
        group: 'address',
        elementType: 'input',
        type: 'text',
    },
    { attribute: 'city', group: 'address', elementType: 'input', type: 'text' },
    {
        attribute: 'zipcode',
        group: 'address',
        elementType: 'input',
        type: 'text',
    },

    // Contact - no group, full width
    { attribute: 'email', elementType: 'input', type: 'email' },
    { attribute: 'phone', elementType: 'input', type: 'tel' },
];
```

### Example 3: Mixed Layout

Combine grouped and ungrouped elements:

```javascript
const elements = [
    {
        attribute: 'name',
        group: 'identity',
        elementType: 'input',
        type: 'text',
    },
    {
        attribute: 'age',
        group: 'identity',
        elementType: 'input',
        type: 'number',
    },
    { attribute: 'bio', elementType: 'textarea' }, // No group - full width
    { attribute: 'country', group: 'location', elementType: 'select' },
    { attribute: 'city', group: 'location', elementType: 'select' },
];
```

## Confirm form submission

Use `submitConfirmation` when a form changes high-impact or destructive data.
The form validates its values before it opens the confirmation modal. It calls
`onSubmit` only after the user confirms.

The following example confirms every valid submission:

```jsx
<Form
    scope="instance_setting"
    elements={elements}
    values={values}
    onSubmit={updateInstanceSettings}
    submitConfirmation={{
        title: t('edit.instance.confirm.title'),
        message: t('edit.instance.confirm.warning'),
        confirmText: t('edit.instance.confirm.submit'),
    }}
/>
```

Use `when` to confirm only submissions that change specific fields:

```jsx
<Form
    scope="instance_setting"
    elements={elements}
    values={values}
    onSubmit={updateInstanceSettings}
    submitConfirmation={{
        title: t('edit.instance.confirm.title'),
        message: t('edit.instance.confirm.warning'),
        when: ({ dirtyFields }) => dirtyFields.includes('umbrella_project_id'),
    }}
/>
```

The `when` function receives the following form state:

- `values`: Current form values.
- `initialValues`: Values used as the current clean baseline.
- `dirtyFields`: Names of fields that differ from the clean baseline.

The `submitConfirmation` object supports the following properties:

- `title` (required): Confirmation modal heading.
- `message` (required): Warning or explanation shown before the actions.
- `confirmText` (optional): Confirm button text. Defaults to the translated
  submit label.
- `cancelText` (optional): Cancel button text. Defaults to the translated cancel
  label.
- `confirmColor` (optional): Confirm button color. Accepts `primary`,
  `secondary`, `error`, or `success`; defaults to `primary`.
- `className` (optional): Additional class for the modal.
- `when` (optional): Function that determines whether the submission requires
  confirmation. Without this function, every valid submission requires
  confirmation.

Cancelling keeps the form values dirty, so the user can review or resubmit the
change. A successful submission closes the modal and establishes the submitted
values as the clean baseline. A failed asynchronous submission leaves the modal
open for another attempt; the form's parent remains responsible for displaying
the error.

Combine `submitConfirmation` with `disableIfUnchanged` to prevent submission
until at least one field changes:

```jsx
<Form
    disableIfUnchanged
    submitConfirmation={{
        title: t('edit.instance.confirm.title'),
        message: t('edit.instance.confirm.warning'),
    }}
    {...formProps}
/>
```

## CSS Layout Control

Control the visual layout of form rows using CSS. Each `form-row` has both a generic `form-row` class and a semantic `form-row--{groupName}` class.

### Basic CSS

```css
.form-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

/* Full width (default for ungrouped) */
[class*='form-row--single-'] {
    width: 100%;
}

.form-group {
    flex: 1;
    min-width: 200px;
}
```

### CSS Grid Layout

For more control, use CSS Grid:

```css
.form-row--personal {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns */
    gap: 1rem;
}

.form-row--address {
    display: grid;
    grid-template-columns: 1fr 0.5fr; /* Street full, zipcode half */
    gap: 1rem;
}

.form-row--location {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* Three columns */
    gap: 1rem;
}
```

### Responsive Layout

```css
@media (max-width: 768px) {
    .form-row--personal {
        grid-template-columns: 1fr; /* Stack on mobile */
    }

    .form-row--address {
        grid-template-columns: 1fr; /* Full width on mobile */
    }
}
```

### Ungrouped Elements

Ungrouped elements automatically get semantic class names based on their attribute:

```javascript
{
    attribute: 'email';
} // → form-row--single-email
{
    attribute: 'newsletter_consent';
} // → form-row--single-newsletter_consent
{
    elementType: 'extra';
} // → form-row--single-element
```

This allows fine-grained CSS control over individual fields if needed:

```css
.form-row--single-email {
    margin-bottom: 2rem; /* Extra spacing after email */
}
```
