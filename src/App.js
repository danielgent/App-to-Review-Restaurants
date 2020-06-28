import React from "react";
import { Box, ThemeProvider, CSSReset } from "@chakra-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import LogOut from "./pages/LogOut";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import UserContext from "contexts/user-context";

import "./App.css";

function App() {
  const [user, setUser] = React.useState(null);

  // TODO - put user fetching code here and show spinner until fetched. much easier
  return (
    <UserContext.Provider value={{ user, updateUser: setUser }}>
      <ThemeProvider>
        <CSSReset />
        <Router>
          <Box p={2}>
            <Link to="/sign-up">Sign up</Link>
            <Link to="/login">Log in</Link>
            <Link to="/logout">Sign out</Link>
            <Link to="/">View all</Link>
          </Box>
          <Box px={30} py={50} backgroundColor="gray.100">
            <Box backgroundColor="white" rounded="md">
              <Switch>
                <Route path="/sign-up" component={SignUp} />
                <Route path="/login" component={LogIn} />
                <Route path="/logout" component={LogOut} />
                <Route path="/restaurant/:id" component={Restaurant} />
                <Route path="/" component={Home} />
              </Switch>
            </Box>
          </Box>
          <Box>{JSON.stringify(user)}</Box>
        </Router>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
