export const get_sender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
