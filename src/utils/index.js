exports.requiredFields = (fields) => {
  const {requireInputs, body} = fields;
  const nullsInputs = [];
  requireInputs.forEach((input) => {
    if (!body[input]) {
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
