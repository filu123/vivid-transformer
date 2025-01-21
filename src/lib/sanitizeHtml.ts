// src/lib/sanitizeHtml.ts
import DOMPurify from 'dompurify';


export const sanitizeHtml = (dirty: string) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'u', 'a', 'ul', 'ol',
      'li', 'p', 'br', 'input', 'label', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'style', 'type', 'checked', 'onclick'
    ],
    ADD_ATTR: ['class'], // Allow class attribute for styling
  });
};

