import React from "react";

const UserContext = React.createContext({
  user: null,
  updateUser: () => {},
});

export default UserContext;
