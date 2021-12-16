// base controller handled here
const _response = require("../response/response");
const Message_response = require("../response/messages");

const base = (try_block) => {
  try {
    try_block();
  } catch (err) {
    const response = _response.error(Message_response.Unknown);
    res.status(200).json(response);
  }
};

module.exports = {
  base,
};
