# Forms Module

The forms module provides flexible, accessible form components with support for complex layouts, validation, and field grouping.

## Table of Contents

- [Element Grouping](#element-grouping)
- [Usage Examples](#usage-examples)
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
