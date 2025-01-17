import React from "react";
import { Flex, ThemeProvider, CSSReset } from "@chakra-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import SignUp from "pages/SignUp";
import LogIn from "pages/LogIn";
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
import ErrorBoundary from "components/ErrorBoundary";

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <ErrorBoundary>
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
              minHeight="calc(100vh - 80px)"
            >
              <Switch>
                <Route path="/sign-up" component={SignUp} />
                <Route path="/login" component={LogIn} />
                <Route path="/verify/:code" component={Verify} />
                {user && (
                  <>
                    <Route path="/profile" component={Profile} />
                    <Route path="/restaurant/:id" component={Restaurant} />
                    <Route path="/admin/users" component={ViewUsers} />
                    <Route
                      path="/admin/restaurants"
                      component={ViewRestaurants}
                    />
                    <Route path="/admin/reviews" component={ViewReviews} />
                    <Route exact path="/" component={Home} />
                  </>
                )}
              </Switch>
            </Flex>
          </Router>
        </ThemeProvider>
      </UserContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
