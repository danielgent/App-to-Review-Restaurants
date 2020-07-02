import React from "react";
import { Box, Stack, Link as Clink, Flex } from "@chakra-ui/core";
import { Link, useHistory } from "react-router-dom";

import { LOCAL_STORAGE_TOKEN_KEY, ROLES } from "globalConstants";
import UserContext from "contexts/user-context";

const Menu = () => {
  let history = useHistory();
  const { updateUser, user } = React.useContext(UserContext);

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
        {user && user.role === ROLES.admin && (
          <>
            <Box>
              <Link to="/admin/users">View all users</Link>
            </Box>
            <Box>
              <Link to="/admin/restaurants">View all restaurants</Link>
            </Box>
            <Box>
              <Link to="/admin/reviews">View all reviews</Link>
            </Box>
          </>
        )}
      </Stack>
      {/* show profile image here. that should be in context then, and returned from /me endpoint */}
      <Link to="/profile">Profile</Link>
    </Flex>
  );
};

export default Menu;
