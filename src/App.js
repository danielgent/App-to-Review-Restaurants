import React from "react";
import { Box, Flex, ThemeProvider, CSSReset } from "@chakra-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import LogOut from "./pages/LogOut";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";

import "./App.css";

function App() {
  // TODO - put user fetching code here and show spinner until fetched. much easier
  return (
    <ThemeProvider>
      <CSSReset />
      <Router>
        <Box p={2}>
          <Flex>
            {/* TODO - use that menu component */}
            <Link to="/sign-up">Sign up</Link>
            <Link to="/login">Log in</Link>
            <Link to="/logout">Sign out</Link>
          </Flex>
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
