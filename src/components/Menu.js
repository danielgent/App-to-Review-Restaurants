import React from "react";
import { Box, Stack, Link as Clink, Flex } from "@chakra-ui/core";
import { Link, useHistory } from "react-router-dom";

import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";
import UserContext from "contexts/user-context";

const Menu = () => {
  let history = useHistory();
  const { updateUser } = React.useContext(UserContext);

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    updateUser();
    history.push("/login");
  };

  return (
    <Flex p={4}>
      <Stack isInline spacing={2} flexGrow={1}>
        <Box>
          <Link to="/sign-up">Sign up</Link>
        </Box>
        <Box>
          <Link to="/login">Log in</Link>
        </Box>
        <Box>
          <Clink onClick={logout}>Log out</Clink>
        </Box>
        <Box>
          <Link to="/">View all</Link>
        </Box>
      </Stack>
      {/* show profile image here. that should be in context then, and returned from /me endpoint */}
      <Link to="/profile">Profile</Link>
    </Flex>
  );
};

export default Menu;
