export const sendUser = (userModel) => {
  const user = {
    username: userModel.username,
    avatar: { url: userModel.avatar.url },
    createdAt: userModel.createdAt,
    updatedAt: userModel.updatedAt,
  };

  return user;
};
