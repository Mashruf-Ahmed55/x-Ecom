const returID = (user: any) => {
  if (!user) {
    throw new Error(`User not found`);
  }
  const userId = String((user as { _id: string })._id);
  return userId;
};

export default returID;
