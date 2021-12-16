// this file is used as shared preference

var customer_profile = "";

const set_customer_profile = (profile) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve((customer_profile = profile));
    }, 1000);
  });

const get_customer_profile = () =>
  new Promise((resolve, reject) => {
    // console.log("from_service", customer_profile);
    setTimeout(() => {
      console.log("from_service", customer_profile);
      resolve(customer_profile);
    }, 1000);
  });

module.exports = {
  set_customer_profile,
  get_customer_profile,
};
