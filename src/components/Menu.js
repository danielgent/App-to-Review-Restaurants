import React from "react";
import { Box, Stack, Link as Clink, Flex } from "@chakra-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useGoogleLogout } from "react-google-login";

import { LOCAL_STORAGE_TOKEN_KEY, ROLES } from "globalConstants";
import UserContext from "contexts/user-context";
import Avatar from "components/Avatar";

const MenuItem = (props) => <Box px={6} py={3} fontWeight="bold" {...props} />;

const Menu = () => {
  let history = useHistory();
  const { updateUser, user } = React.useContext(UserContext);

  const { signOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  });

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    updateUser();
    signOut();
    history.push("/login");
  };

  return (
    <Flex p={4}>
      <Stack isInline spacing={2} flexGrow={1}>
        {!user && (
          <>
            <MenuItem>
              <Link to="/sign-up">Sign up</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/login">Log in</Link>
            </MenuItem>
          </>
        )}
        {user && (
          <>
            <MenuItem>
              <Clink onClick={logout}>Log out</Clink>
            </MenuItem>
            <MenuItem>
              <Link to="/">View all</Link>
            </MenuItem>
            {user.role === ROLES.admin && (
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
          </>
        )}
      </Stack>
      {user && (
        <Link to="/profile">
          <Stack
            isInline
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <MenuItem>Profile</MenuItem>
            <Avatar user={user} />
          </Stack>
        </Link>
      )}
    </Flex>
  );
};

export default Menu;
