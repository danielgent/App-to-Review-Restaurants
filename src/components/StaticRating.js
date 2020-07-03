import React from "react";
import Rating from "@material-ui/lab/Rating";

const StaticRating = (props) => (
  <Rating name="read-only" readOnly precision={0.1} {...props} />
);

export default StaticRating;
