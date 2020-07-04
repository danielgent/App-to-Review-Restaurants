import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@chakra-ui/core";

function BackButton({ children }) {
  let history = useHistory();
  return (
    <Button leftIcon="chevron-left" onClick={() => history.goBack()} size="sm">
      Back
    </Button>
  );
}

export default BackButton;
