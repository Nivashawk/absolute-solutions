// messages handled here

const noResult = (name) => {
  return `No ${name} found`;
};
const notUpdated = (name) => {
  return `${name} not updated in document`;
};
const invalidCredentials = (username, password) => {
  return `please check the credentials username: ${username}, password: ${password}`;
};
const getAll = (name) => {
  return `list of all ${name} fetched successfully`;
};
const getOne = (name) => {
  return `${name} fetched successfully`;
};
const uploadImage = (error) => {
  return `${error}`;
};
const alreadyExits = (name, id) => {
  return `document with this ${name} ${id} already exits`;
};
const Unknown = "Unknown Error Found From Server Side";
const emptyDatabase = "Unknown Error Found From Server Side";
const Insert = "document were inserted succssfully";
const login = "you have been logged in successfully";

module.exports = {
  noResult,
  notUpdated,
  invalidCredentials,
  getAll,
  getOne,
  uploadImage,
  alreadyExits,
  Unknown,
  emptyDatabase,
  Insert,
  login,
};
