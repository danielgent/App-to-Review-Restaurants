import React from "react";
import {
  Box,
  Heading,
  Text,
  CircularProgress,
  Stack,
  Image,
  Flex,
} from "@chakra-ui/core";
import { useParams } from "react-router-dom";

import CommentItem from "components/CommentItem";
import CreateReviewButton from "components/CreateReviewButton";
import StaticRating from "components/StaticRating";
import BackButton from "components/BackButton";

import { authAxios } from "utils";
import { Container } from "components/Styled";
import UserContext from "contexts/user-context";
import { ROLES } from "globalConstants";
import { makeImageUrl } from "utils";

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
    galleryImage,
  } = restaurant;

  const src = galleryImage && makeImageUrl(galleryImage);

  const hasReviews = recentReviews.length > 0;

  const innerContent = !hasReviews ? (
    <Text mb={6}>No reviews yet</Text>
  ) : (
    <>
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
        <Stack
          spacing="8"
          height="500px"
          overflowY="scroll"
          border="solid"
          p={8}
          mx={-8}
        >
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
        <Flex
          mb={6}
          justifyContent="stretch"
          flexDirection={{ xs: "column", md: "row" }}
        >
          <Heading flexGrow={1} as="h1">
            {name}
          </Heading>
          {hasReviews && (
            <>
              <Box mr={8}>
                <StaticRating value={averageRating} size="large" />
              </Box>
              <BackButton />
            </>
          )}
        </Flex>
        {src && <Image src={src} alt="Gallery Image" mb={8} />}
        {innerContent}
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
