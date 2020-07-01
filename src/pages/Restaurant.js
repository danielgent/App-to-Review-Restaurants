import React from "react";
import {
  Box,
  Heading,
  Text,
  CircularProgress,
  useDisclosure,
  Button,
  Stack,
} from "@chakra-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";

import CommentItem from "components/CommentItem";
import AddReviewModal from "components/AddReviewModal";
import { getAuthHeader } from "utils";

const SectionTitle = (props) => (
  <Heading as="h2" size="md" mb={6} color="gray.600" {...props} />
);

const Section = (props) => <Box padding={2} mb={4} {...props} />;

const refetch = ({ setIsLoading, setRestaurant, id }) => {
  setIsLoading(true);
  axios
    .get(`${process.env.REACT_APP_API_URL}/restaurants/${id}`, {
      headers: getAuthHeader(),
    })
    .then((response) => {
      setRestaurant(response.data);
    })
    .finally(() => {
      setIsLoading(false);
    });
};

const Restaurant = () => {
  let { id } = useParams();

  const [restaurant, setRestaurant] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    refetch({
      setIsLoading,
      setRestaurant,
      id,
    });
  }, [id]);

  const handleSubmit = () => {
    refetch({
      setIsLoading,
      setRestaurant,
      id,
    });
    onClose();
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  const {
    name,
    averageRating,
    highReview,
    lowReview,
    recentReviews,
  } = restaurant;

  const innerContent =
    recentReviews.length === 0 ? (
      <Text mb={6}>No reviews yet</Text>
    ) : (
      <>
        <Text>Avg {averageRating}</Text>
        <Section
          backgroundColor="green.100"
          borderColor="green.400"
          borderWidth="2px"
          padding={4}
          rounded="md"
        >
          <SectionTitle>Top review</SectionTitle>
          <CommentItem
            review={highReview}
            // TODO - remove in future when showing correct list of unreplied reviews
            refreshData={() => {
              refetch({
                setIsLoading,
                setRestaurant,
                id,
              });
            }}
          />
        </Section>
        <Section
          backgroundColor="red.100"
          borderColor="red.400"
          borderWidth="2px"
          padding={4}
          rounded="md"
        >
          <SectionTitle>Worst review</SectionTitle>
          <CommentItem
            review={lowReview}
            // TODO - remove in future when showing correct list of unreplied reviews
            refreshData={() => {
              refetch({
                setIsLoading,
                setRestaurant,
                id,
              });
            }}
          />
        </Section>
        <Section>
          <SectionTitle>Recent reviews</SectionTitle>
          <Stack spacing="8">
            {recentReviews.map((review) => (
              <CommentItem
                key={review._id}
                review={review}
                // TODO - remove in future when showing correct list of unreplied reviews
                refreshData={() => {
                  refetch({
                    setIsLoading,
                    setRestaurant,
                    id,
                  });
                }}
              />
            ))}
          </Stack>
        </Section>
      </>
    );

  return (
    <Box p={4}>
      <Heading as="h1">{name}</Heading>
      <Box p={8}>{innerContent}</Box>
      <Button onClick={onOpen}>Rate this restaurant</Button>
      <AddReviewModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        restaurantId={id}
      />
    </Box>
  );
};

Restaurant.propTypes = {};

export default Restaurant;
