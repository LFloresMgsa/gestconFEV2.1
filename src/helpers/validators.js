import purify from 'dompurify';

export const isValidEmail = (val) => {
  if (typeof val !== 'undefined') {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );

    if (!pattern.test(val)) {
      return false;
    } else {
      return true;
    }
  }
};

export const validateURL = (url) => {
  const parsed = new URL(url);
  return ['https:', 'http:'].includes(parsed.protocol);
};

export const sanitizeHTML = (value) => {
  return { __html: purify.sanitize(value) };
};
