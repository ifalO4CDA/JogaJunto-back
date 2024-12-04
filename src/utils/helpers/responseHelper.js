const createResponse = ({ status, data = {}, message = "", errors = {} }) => {
    return {
      status,
      data,
      message,
      errors,
    };
  };
  
  module.exports = createResponse;
  