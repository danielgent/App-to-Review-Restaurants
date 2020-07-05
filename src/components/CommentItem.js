import { Box, Flex, Stack, Divider, Text } from "@chakra-ui/core";
import React from "react";

import StaticRating from "components/StaticRating";
import Avatar from "components/Avatar";

import { convertIsoStringToDateObject } from "utils";

const CommentItem = ({ review, refreshData, ...rest }) => {
  const { reviewer, comment, visitDate, rating, reply } = review;
  const { name } = reviewer;

  const formattedDate = convertIsoStringToDateObject(visitDate).toDateString();

  return (
    <Box {...rest}>
      <Flex mb={16}>
        <Stack
          spacing="2"
          flexBasis="100px"
          flexShrink={0}
          mr={4}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Avatar user={reviewer} mb={6} />
          <Text fontStyle="italic" fontSize="xs">
            {name}
          </Text>
        </Stack>
        <Box flexGrow={1}>
          <Text mb={2}>{comment}</Text>
          <StaticRating value={rating} />
          <Text mt={2} fontSize="xs" fontStyle="italic" color="grey.500">
            {formattedDate}
          </Text>
        </Box>
      </Flex>
      {reply && (
        <>
          <Divider my={4} />
          <Box textAlign="right">
            <Text fontStyle="italic" fontSize="sm" color="gray.600" mb={2}>
              {reply}
            </Text>
            <Text fontSize="xs">Reply from the owner</Text>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CommentItem;
