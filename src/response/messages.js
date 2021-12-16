// messages handled here

const No_result = (name) => {
  return `No ${name} found`;
};
const Not_updated = (name1) => {
  return `${name} not updated in document`;
};
const Invalid_credentials = (username, password) => {
  return `please check the credentials username: ${username}, password: ${password}`;
};
const Get_all = (name) => {
  return `list of all ${name} fetched successfully`;
};
const Get_one = (name) => {
  return `${name} fetched successfully`;
};
const Upload_image = (error) => {
  return `${error}`;
};
const Already_exits = (name, _id) => {
  return `document with this ${name} ${_id} already exits`;
};
const Unknown = `Unknown Error Found From Server Side`;
const Empty_database = `Unknown Error Found From Server Side`;
const Insert = `document were inserted succssfully`;
const Login = `you have been logged in successfully`;

module.exports = {
  No_result,
  Not_updated,
  Invalid_credentials,
  Get_all,
  Get_one,
  Upload_image,
  Already_exits,
  Unknown,
  Empty_database,
  Insert,
  Login,
};
