# Frontend Security

## HTML Sanitization Best Practices (React Frontend)

**Always sanitize user-controlled HTML content before rendering with `dangerouslySetInnerHTML`.**

This project uses DOMPurify via a centralized `sanitizeHtml` utility to prevent XSS attacks. Import and use it whenever rendering HTML from untrusted sources:

```javascript
import { sanitizeHtml } from 'modules/utils';

// For rich text content (CMS fields, collections, interviews)
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content, 'RICH_TEXT') }} />

// For basic formatted text (banners, annotations)
<p dangerouslySetInnerHTML={{ __html: sanitizeHtml(text, 'BASIC') }} />

// For search results with highlighting
<span dangerouslySetInnerHTML={{ __html: sanitizeHtml(highlighted, 'SEARCH_RESULT') }} />

// For error messages (strip all HTML)
<p dangerouslySetInnerHTML={{ __html: sanitizeHtml(error, 'PLAIN_TEXT') }} />
```

**Available sanitization configs:**

Settings can be changed in `app/javascript/modules/constants/index.js`.

- `PLAIN_TEXT`: Strips all HTML (use for error messages, plain text)
- `BASIC`: Allows `<p>`, `<br>`, `<strong>`, `<em>`, `<a>` (use for banners, simple content)
- `RICH_TEXT`: Allows headings, lists, blockquotes (use for CMS-editable content)
- `SEARCH_RESULT`: Allows only `<mark>`, `<em>`, `<strong>` (use for Solr search highlights)

**When to sanitize:**

- User-editable content (annotations, biographical entries, etc.)
- Admin-controlled content (project descriptions, collection notes, banners)
- Search results with highlighting from Solr
- Any content from external sources or database that contains HTML
- ❌ Translation strings from `t()` helper (already safe, but sanitizing adds defense-in-depth)

See `app/javascript/modules/utils/sanitizeHtml.js` for implementation details and `sanitizeHtml.test.js` for comprehensive test coverage.
