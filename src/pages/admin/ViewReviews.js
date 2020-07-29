import React from "react";
import { Text, useToast, Button } from "@chakra-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import EditReviewModal from "components/EditReviewModal";
import ConfirmationModal from "components/ConfirmationModal";
import { Container, Heading } from "components/Styled";
import { authAxios } from "utils";
import GlobalLoading from "components/GlobalLoading";

const HeaderText = (props) => <Text fontWeight="bold" {...props} />;

const ViewReviews = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [reviews, setReviews] = React.useState([]);
  const [reviewToEdit, setReviewToEdit] = React.useState(null);
  const [reviewToDelete, setReviewToDelete] = React.useState(null);

  const toast = useToast();

  const fetchReviews = () => {
    setIsLoading(true);
    authAxios
      .get(`${process.env.REACT_APP_API_URL}/reviews`)
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
    authAxios
      .delete(`${process.env.REACT_APP_API_URL}/reviews/${reviewToDelete._id}`)
      .then(function (response) {
        toast({
          description: "Review succesfully deleted",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setReviewToDelete();
        fetchReviews();
      });
  };

  return (
    <Container maxWidth={1200}>
      <Heading>View reviews</Heading>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>{review.comment}</TableCell>
                  <TableCell>{review.rating}</TableCell>
                  <TableCell>{review.visitDate}</TableCell>
                  <TableCell>{review.reply}</TableCell>
                  <TableCell p={2}>
                    <Button onClick={() => setReviewToEdit(review)}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell p={2}>
                    <Button onClick={() => setReviewToDelete(review)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
        </>
      )}
    </Container>
  );
};

export default ViewReviews;
