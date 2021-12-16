// RESPONSE HANDLED HERE

const error = (message) => {
  const response = {
    code: 201,
    status: "failure",
    message,
  };
  return response;
};

const success = (message, result, document_count) => {
  const response = {
    code: 200,
    status: "success",
    message,
    document_count,
    result,
  };
  return response;
};

module.exports = {
  error,
  success,
};
