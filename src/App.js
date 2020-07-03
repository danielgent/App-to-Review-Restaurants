import React from "react";
import { Box, Flex, ThemeProvider, CSSReset } from "@chakra-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import SignUp from "pages/SignUp";
import LogIn from "pages/LogIn";
import LogOut from "pages/LogOut";
import Home from "pages/Home";
import Restaurant from "pages/Restaurant";
import Profile from "pages/Profile";
import Verify from "pages/Verify";
import ViewUsers from "pages/admin/ViewUsers";
import ViewRestaurants from "pages/admin/ViewRestaurants";
import ViewReviews from "pages/admin/ViewReviews";

import UserContext from "contexts/user-context";
import UserMe from "components/UserMe";
import Menu from "components/Menu";

import { LOCAL_STORAGE_TOKEN_KEY } from "globalConstants";

function App() {
  const [user, setUser] = React.useState(null);

  // TODO - put user fetching code here and show spinner until fetched. much easier
  return (
    <UserContext.Provider value={{ user, updateUser: setUser }}>
      <ThemeProvider>
        <CSSReset />
        <Router>
          <UserMe />
          <Menu />
          <Flex
            px={30}
            py={50}
            backgroundColor="gray.100"
            alignItems="center"
            justifyContent="center"
          >
            <Switch>
              <Route path="/sign-up" component={SignUp} />
              <Route path="/login" component={LogIn} />
              <Route path="/logout" component={LogOut} />
              <Route path="/restaurant/:id" component={Restaurant} />
              <Route path="/profile" component={Profile} />
              <Route path="/verify/:code" component={Verify} />
              {/* TODO - test what happens when visit this Url and user */}
              <Route path="/admin/users" component={ViewUsers} />
              <Route path="/admin/restaurants" component={ViewRestaurants} />
              <Route path="/admin/reviews" component={ViewReviews} />

              {user && <Route path="/" component={Home} />}
            </Switch>
          </Flex>
          <Box fontStyle="italic" fontSize="xs" backgroundColor="red.100">
            <Box>User context {JSON.stringify(user)}</Box>
            <Box>
              local storage{localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}}
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
