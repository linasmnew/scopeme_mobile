export const isValidName = (text) => {
  return (
    typeof text === 'string'
    && text.length > 0
    && text.length <= 32
    // && !text.match(/[^\w\s\.]/)
  );
}

export const isValidURL = (text) => {
  return (
    typeof text === 'string'
    && text.length > 3
    && text.match(/^[^\.\s]\S*(\.\S+)$/)
  );
}

export const isValidHexCode = (text) => {
  return (
    typeof text === 'string'
    && text.length > 3
    && text.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  );
}
