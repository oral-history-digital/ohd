# User Profile Form Field Alignment

This implementation provides perfect vertical alignment between user profile form fields as requested in the problem statement.

## Problem Solved

The form fields for `user_profile.known_language_id` and `user_profile.unknown_language_id` now stay perfectly aligned vertically with the fields for `user_profile.known_language.code` and `user_profile.unknown_language.code` when displayed on the `user_profiles/index.html.erb` page.

## Key Features

### Perfect Vertical Alignment
- Uses CSS Flexbox with `align-items: end` to ensure form controls align at their baselines
- All form controls have consistent `height: 42px` for uniform appearance
- Labels maintain consistent spacing with `min-height: 20px`

### Responsive Design
- Desktop: Side-by-side layout with perfect alignment
- Mobile: Stacked layout while maintaining visual consistency
- Flexbox ensures equal width distribution with `flex: 1`

### Visual Consistency
- Bordered containers group related fields
- Consistent styling between form and display modes
- Professional appearance with proper focus states

## Files Created/Modified

### Models
- `app/models/user_profile.rb` - UserProfile model with language associations
- `app/models/user.rb` - Added user_profile association

### Controllers
- `app/controllers/user_profiles_controller.rb` - Full CRUD operations

### Views
- `app/views/user_profiles/_form.html.erb` - Form with perfect alignment
- `app/views/user_profiles/_user_profile.html.erb` - Display with matching alignment
- `app/views/user_profiles/index.html.erb` - Main index page
- `app/views/user_profiles/new.html.erb` - New profile page
- `app/views/user_profiles/edit.html.erb` - Edit profile page
- `app/views/user_profiles/show.html.erb` - Show profile page

### Database
- `db/migrate/20241209000001_create_user_profiles.rb` - Migration for user_profiles table

### Authorization
- `app/policies/user_profile_policy.rb` - Pundit policy for access control

### Routes
- Added `resources :user_profiles` to routes.rb

### Tests
- `spec/models/user_profile_spec.rb` - Model tests
- `spec/controllers/user_profiles_controller_spec.rb` - Controller tests
- `spec/factories/user_profiles.rb` - FactoryBot factory

## CSS Implementation

The core alignment is achieved through:

```css
.language-field-row {
  display: flex;
  align-items: end;  /* Perfect vertical alignment */
  gap: 20px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.language-select-field,
.language-code-field {
  flex: 1;  /* Equal width distribution */
  display: flex;
  flex-direction: column;
}

.form-select,
.form-control {
  height: 42px;  /* Consistent height for alignment */
  /* ... other styles */
}
```

This ensures the select dropdown for language ID and the text field for language code are perfectly aligned both horizontally and vertically.