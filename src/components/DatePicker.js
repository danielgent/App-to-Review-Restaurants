import React from "react";
import RDatePicker from "react-datepicker";
import styled from "@emotion/styled";

const StyledDatePicker = styled(RDatePicker)`
  border: 1px solid gray;
  padding: 8px;
  display: block;
`;

const DatePicker = (props) => {
  return <StyledDatePicker dateFormat="MMMM d, yyyy" {...props} />;
};

export default DatePicker;
