import createHttpError from 'http-errors';

const returID = (user: any) => {
  if (!user) {
    throw new Error(`${createHttpError(404, 'User not found')}`);
  }
  const userId = String((user as { _id: string })._id);
  return userId;
};

export default returID;
