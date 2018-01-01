export const isValidEmail = (text) => {
  return (
    typeof text === 'string'
    && text.length > 2
    && text.length < 254
    && text.match(/^[^\s]\S*(\@\S+\.\S+)$/)
  );
}

export const isPasswordValid = (text) => {
  return (
    typeof text === 'string'
    && text.length > 5
  );
}

export const encodeUsername = (text) => {
  return text.replace(/\./g, '%2E');
}

export const isValidUsername = (text) => {
  return (
    typeof text === 'string'
    && text.length > 0
    && text.length < 31
    && !!text.match(/^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/)
  );
}

export const isValidName = (text) => {
  return (
    typeof text === 'string'
    && text.length <= 32
  );
}

export const isValidDescription = (text) => {
  return (
    typeof text === 'string'
    && text.length <= 150
  );
}
