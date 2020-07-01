import React from "react";

// NOTE - think only actually need role here? no need to return id because stored in token and server side can read that
const UserContext = React.createContext({
  user: null,
  updateUser: () => {},
});

export default UserContext;
