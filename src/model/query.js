// All the mongo db queries are handled here

// Admin controller Queries
const find_user = (User_id) => {
  return { User_id };
};

const login = (Username, Password) => {
  return {
    $and: [{ Username }, { Password }],
  };
};

const update_notification_token = (User_id, Notification_Token) => {
  return (
    {
      User_id,
    },
    {
      $set: { Notification_Token },
    }
  );
};

// Customer controller Queries
const find_customer = (Customer_id) => {
  return { Customer_id };
};

// Service controller Queries
const find_service = (Service_id) => {
  return { Service_id };
};

const update_service_in_customer = (
  Customer_id,
  Service_id,
  Name,
  Product_Item
) => {
  return (
    { Customer_id },
    {
      $push: {
        Service_List: {
          Service_id,
          Customer_id,
          Name,
          Product_Item,
        },
      },
    }
  );
};

module.exports = {
  find_user,
  find_customer,
  find_service,
  login,
  update_notification_token,
  update_service_in_customer,
};
