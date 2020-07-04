import React from "react";
import { Box, Heading, Text, CircularProgress, Stack } from "@chakra-ui/core";
import { useParams } from "react-router-dom";

import CommentItem from "components/CommentItem";
import CreateReviewButton from "components/CreateReviewButton";
import StaticRating from "components/StaticRating";

import { authAxios } from "utils";
import { Container } from "components/Styled";
import UserContext from "contexts/user-context";
import { ROLES } from "globalConstants";

const SectionTitle = (props) => (
  <Heading as="h2" size="md" mb={6} color="gray.600" {...props} />
);

const Section = (props) => <Box padding={2} mb={4} {...props} />;

const fetchRestaurant = ({ setIsLoading, setRestaurant, id }) => {
  setIsLoading(true);
  authAxios
    .get(`${process.env.REACT_APP_API_URL}/restaurants/${id}`)
    .then((response) => {
      setRestaurant(response.data);
    })
    .finally(() => {
      setIsLoading(false);
    });
};

const Restaurant = () => {
  let { id } = useParams();
  const { user } = React.useContext(UserContext);

  const [restaurant, setRestaurant] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchRestaurant({
      setIsLoading,
      setRestaurant,
      id,
    });
  }, [id]);

  const handleCreateReview = () => {
    fetchRestaurant({
      setIsLoading,
      setRestaurant,
      id,
    });
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
        <StaticRating value={averageRating} size="large" />

        <Section
          backgroundColor="green.100"
          borderColor="green.400"
          borderWidth="2px"
          padding={4}
          rounded="md"
        >
          <SectionTitle>Top review</SectionTitle>
          <CommentItem review={highReview} />
        </Section>
        <Section
          backgroundColor="red.100"
          borderColor="red.400"
          borderWidth="2px"
          padding={4}
          rounded="md"
        >
          <SectionTitle>Worst review</SectionTitle>
          <CommentItem review={lowReview} />
        </Section>
        <Section>
          <SectionTitle>Recent reviews</SectionTitle>
          <Stack spacing="8">
            {recentReviews.map((review) => (
              <CommentItem key={review._id} review={review} />
            ))}
          </Stack>
        </Section>
      </>
    );

  return (
    <Container maxWidth={1200}>
      <Box p={4}>
        <Heading as="h1">{name}</Heading>
        <Box p={8}>{innerContent}</Box>
        {user.role === ROLES.user && (
          <CreateReviewButton
            user={user}
            restaurantId={id}
            onCreateReview={handleCreateReview}
          />
        )}
      </Box>
    </Container>
  );
};

Restaurant.propTypes = {};

export default Restaurant;
