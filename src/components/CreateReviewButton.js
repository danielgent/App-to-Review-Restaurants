import { CircularProgress, useDisclosure, Button } from "@chakra-ui/core";
import React from "react";
import AddReviewModal from "components/AddReviewModal";
import axios from "axios";

import { getAuthHeader } from "utils";

const CreateReviewButton = ({ onCreateReview, restaurantId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(true);
  const [showReviewButton, setShowReviewButton] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/reviews/me/restaurant/${restaurantId}`,
        {
          headers: getAuthHeader(),
        }
      )
      .then((response) => {
        setShowReviewButton(!response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [restaurantId]);

  const handleSubmit = () => {
    onClose();
    onCreateReview();
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    showReviewButton && (
      <>
        <Button onClick={onOpen}>Rate this restaurant</Button>
        <AddReviewModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
          restaurantId={restaurantId}
        />
      </>
    )
  );
};

export default CreateReviewButton;
