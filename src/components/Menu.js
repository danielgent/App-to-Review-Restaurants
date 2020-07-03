import React from "react";
import { Box, Stack, Link as Clink, Flex, Avatar } from "@chakra-ui/core";
import { Link, useHistory } from "react-router-dom";

import { LOCAL_STORAGE_TOKEN_KEY, ROLES } from "globalConstants";
import UserContext from "contexts/user-context";

const MenuItem = (props) => <Box px={6} py={3} fontWeight="bold" {...props} />;

const Menu = () => {
  let history = useHistory();
  const { updateUser, user } = React.useContext(UserContext);

  const { username, avatarImageUrl } = user || {};

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    updateUser();
    history.push("/login");
  };

  return (
    <Flex p={4}>
      <Stack isInline spacing={2} flexGrow={1}>
        <MenuItem>
          <Link to="/sign-up">Sign up</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/login">Log in</Link>
        </MenuItem>
        <MenuItem>
          <Clink onClick={logout}>Log out</Clink>
        </MenuItem>
        <MenuItem>
          <Link to="/">View all</Link>
        </MenuItem>
        {user && user.role === ROLES.admin && (
          <>
            <MenuItem>
              <Link to="/admin/users">View all users</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/admin/restaurants">View all restaurants</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/admin/reviews">View all reviews</Link>
            </MenuItem>
          </>
        )}
      </Stack>
      {user && (
        <Stack isInline spacing={2} alignItems="center" justifyContent="center">
          <MenuItem>
            <Link to="/profile">Profile</Link>
          </MenuItem>
          <Avatar name={username} src={avatarImageUrl} />
        </Stack>
      )}
    </Flex>
  );
};

export default Menu;
