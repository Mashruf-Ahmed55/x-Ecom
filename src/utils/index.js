const returID = (user) => {
  if (!user) {
    throw new Error(`User not found`);
  }
  const userId = String(user._id);
  return userId;
};

export default returID;
