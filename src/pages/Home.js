import React from "react";

import OwnerHomepage from "components/OwnerHomepage";
import UserHomepage from "components/UserHomepage";
import UserContext from "contexts/user-context";
import { ROLES } from "globalConstants";

const Home = (props) => {
  const { user } = React.useContext(UserContext);

  if (user.role === ROLES.owner) {
    return <OwnerHomepage />;
  }

  return <UserHomepage />;
};

Home.propTypes = {};

export default Home;
