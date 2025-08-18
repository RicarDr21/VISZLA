const User = require('../models/userModel');

const deleteUserById = async (id) => {
  const r = await User.deleteOne({ _id: id });
  return r.deletedCount > 0;
};

const suspendUser = async (id) => {
  const r = await User.updateOne({ _id: id }, { $set: { suspended: true } });
  return r.modifiedCount > 0;
};

const reactivateUser = async (id) => {
  const r = await User.updateOne({ _id: id }, { $set: { suspended: false } });
  return r.modifiedCount > 0;
};

module.exports = { deleteUserById, suspendUser, reactivateUser };
