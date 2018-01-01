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
