import React from "react";
import { Link } from "react-router-dom";
import { Text, Flex, Image, AspectRatioBox, Box } from "@chakra-ui/core";

import StaticRating from "components/StaticRating";
import FallbackLogo from "fixtures/baby-bird.png";
import { makeImageUrl } from "utils";

const RestaurantListItem = ({ restaurant }) => {
  const { name, _id, averageRating, profileImage } = restaurant;

  const src = profileImage ? makeImageUrl(profileImage) : FallbackLogo;

  return (
    <Link to={`/restaurant/${_id}`}>
      <Flex
        p={4}
        border="1px solid black"
        rounded="lg"
        mb={2}
        justifyContent="space-between"
        alignItems="center"
        boxShadow="md"
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Text flexGrow="1">{name}</Text>
        <Box mr={3}>
          <StaticRating value={averageRating} size="large" />
        </Box>
        <Box rounded="lg" overflow="hidden">
          <AspectRatioBox ratio={1} minWidth="150px">
            <Image src={src} alt="Profile image" objectFit="cover" />
          </AspectRatioBox>
        </Box>
      </Flex>
    </Link>
  );
};

export default RestaurantListItem;
