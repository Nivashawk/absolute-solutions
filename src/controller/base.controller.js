// base controller handled here
const response = require("../response/response");
const messageResponse = require("../response/messages");


const base = (tryBlock,res,req) => {
  try {
    tryBlock();
  } catch (err) {
    const responseObject = response.error(messageResponse.Unknown);
    res.status(200).json(responseObject);
  }
};



module.exports = {
  base
};
