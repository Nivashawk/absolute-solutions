// All the mongo db queries are handled here

// Admin controller Queries
const findUser = (userId) => {
  return { userId };
};

const login = (userName, password) => {
  return {
    $and: [{ userName }, { password }],
  };
};

const updateNotificationToken = (userId, notificationToken) => {
  return (
    {
      userId,
    },
    {
      $set: { notificationToken },
    }
  );
};

// Customer controller Queries
const findCustomer = (customerId) => {
  return { customerId };
};

// Service controller Queries
const findService = (serviceId) => {
  return { serviceId };
};

const updateServiceInCustomer = (customerId, serviceId, Name, productItem) => {
  return (
    { customerId },
    {
      $push: {
        serviceList: {
          serviceId,
          customerId,
          Name,
          productItem,
        },
      },
    }
  );
};

module.exports = {
  findUser,
  findCustomer,
  findService,
  login,
  updateNotificationToken,
  updateServiceInCustomer,
};
