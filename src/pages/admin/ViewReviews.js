import React from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  SimpleGrid,
  Text,
  useToast,
  Button,
} from "@chakra-ui/core";

import { getAuthHeader } from "utils";
import EditReviewModal from "components/EditReviewModal";
import ConfirmationModal from "components/ConfirmationModal";
import { Container, Heading, TableCell } from "components/Styled";

const HeaderText = (props) => <Text fontWeight="bold" {...props} />;

const ViewReviews = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [reviews, setReviews] = React.useState([]);
  const [reviewToEdit, setReviewToEdit] = React.useState(null);
  const [reviewToDelete, setReviewToDelete] = React.useState(null);

  const toast = useToast();

  const fetchReviews = () => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/reviews`, {
        headers: getAuthHeader(),
      })
      .then((response) => {
        setReviews(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateReview = () => {
    fetchReviews();
    setReviewToEdit(null);
  };

  const handleDeleteReview = () => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/reviews/${reviewToDelete._id}`,
        {
          headers: getAuthHeader(),
        }
      )
      .then(function (response) {
        toast({
          description: "Review succesfully deleted",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setReviewToDelete();
        fetchReviews();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  if (isLoading) {
    return <CircularProgress isIndeterminate color="green"></CircularProgress>;
  }

  return (
    <Container maxWidth={1200}>
      <Heading>View reviews</Heading>
      <SimpleGrid
        columns={6}
        borderColor="gray.600"
        borderWidth="1px"
        borderStyle="solid"
        borderRight="none"
        borderBottom="none"
      >
        <TableCell>
          <HeaderText>Comment</HeaderText>
        </TableCell>
        <TableCell>
          <HeaderText>Rating</HeaderText>
        </TableCell>
        <TableCell>
          <HeaderText>Visit Date</HeaderText>
        </TableCell>
        <TableCell>
          <HeaderText>Reply</HeaderText>
        </TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        {reviews.map((review) => (
          <React.Fragment key={review._id}>
            {/* TODO - should enrich data then pull down resturant name and username. or group by restaurant? */}
            <TableCell>{review.comment}</TableCell>
            <TableCell>{review.rating}</TableCell>
            <TableCell>{review.visitDate}</TableCell>
            <TableCell>{review.reply}</TableCell>
            <TableCell p={2}>
              <Button onClick={() => setReviewToEdit(review)}>
                Edit review
              </Button>
            </TableCell>
            <TableCell p={2}>
              <Button onClick={() => setReviewToDelete(review)}>
                Delete review
              </Button>
            </TableCell>
          </React.Fragment>
        ))}
      </SimpleGrid>
      <EditReviewModal
        isOpen={!!reviewToEdit}
        onClose={() => setReviewToEdit(null)}
        onSubmit={handleUpdateReview}
        review={reviewToEdit}
      />
      <ConfirmationModal
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleDeleteReview}
      >
        Are you sure you want to delete this review
        {reviewToDelete?.reviewname}?
      </ConfirmationModal>
    </Container>
  );
};

export default ViewReviews;
