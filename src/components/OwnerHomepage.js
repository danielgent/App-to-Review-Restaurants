import React from "react";
import {
  Box,
  CircularProgress,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/core";

import RestaurantListItem from "components/RestaurantListItem";
import AddRestaurantModal from "components/AddRestaurantModal";
import AddReplyModal from "components/AddReplyModal";
import CommentItem from "components/CommentItem";
import { Container, Heading } from "components/Styled";
import { getAuthHeader, authAxios } from "utils";

const fetchRestaurants = async () =>
  authAxios
    .get(`${process.env.REACT_APP_API_URL}/restaurants/me`, {
      headers: getAuthHeader(),
    })
    .then((response) => response.data);

const fetchReviews = async () =>
  authAxios
    .get(`${process.env.REACT_APP_API_URL}/reviews/me/unreplied`, {
      headers: getAuthHeader(),
    })
    .then((response) => response.data);

const OwnerHomepage = () => {
  const [restaurants, setRestaurants] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [reviewIdToReply, setReviewIdToReply] = React.useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    setIsLoading(true);

    fetchRestaurants()
      .then((restaurants) => {
        setRestaurants(restaurants);
        return fetchReviews();
      })
      .then((reviews) => {
        setReviews(reviews);
        setIsLoading(false);
      });
  }, []);

  const handleCreateRestaurant = async () => {
    setIsLoading(true);
    const restaurants = await fetchRestaurants();
    setRestaurants(restaurants);

    setIsLoading(false);
    onClose();
  };

  const handleReplyToReview = async () => {
    const reviews = await fetchReviews();
    setReviews(reviews);
    setReviewIdToReply();
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Container maxWidth={700}>
      <Heading>Your Restaurants</Heading>
      {restaurants.map((restaurant) => (
        <RestaurantListItem key={restaurant._id} restaurant={restaurant} />
      ))}
      <Heading>Unreplied Reviews</Heading>
      <Box>
        {reviews.length === 0 ? (
          <Text>All your reviews are replied to</Text>
        ) : (
          reviews.map((review) => (
            <Box key={review._id}>
              <CommentItem review={review} />
              <Button onClick={() => setReviewIdToReply(review._id)}>
                Reply to review
              </Button>
            </Box>
          ))
        )}
      </Box>
      <AddReplyModal
        isOpen={!!reviewIdToReply}
        onClose={() => setReviewIdToReply(null)}
        onSubmit={handleReplyToReview}
        reviewId={reviewIdToReply}
      />
      <Button onClick={onOpen}>Create new restaurant</Button>
      <AddRestaurantModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateRestaurant}
      />
    </Container>
  );
};

export default OwnerHomepage;
