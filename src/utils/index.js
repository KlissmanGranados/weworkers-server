exports.requiredFields = (fields) => {
  const {requireInputs, body} = fields;
  const excludes = fields.excludes || [];
  const nullsInputs = [];
  requireInputs.forEach((input) => {
    if (!body[input] && excludes.indexOf(input) <0 ) {
      nullsInputs.push(input);
    }
  });
  return nullsInputs;
};

exports.checkEmail = (email) => {
  let regexStr = '';
  regexStr += '^(([^<>()[\\]\\.,;:\\s@\\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\\"]+';
  regexStr += ')*)|(\\\".+\\\"))@(([^<>()[\\]\\.,;:\\s@\\\"]+\\.)+';
  regexStr += '[^<>()[\\]\\.,;:\\s@\\\"]{2,})$';
  return new RegExp(regexStr).test(email);
};

exports.checkIntegers = (value) => {
  return value.split(/[0-9]/).length-1 == value.length;
};
