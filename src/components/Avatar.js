import React from "react";
import { Avatar as CAvatar } from "@chakra-ui/core";

const makeAvatarImageUrl = (avatarFilename) =>
  avatarFilename.includes("http")
    ? avatarFilename
    : `${process.env.REACT_APP_API_URL}/${avatarFilename}`;

const Avatar = ({ user }) => {
  return (
    <CAvatar
      name={user.username}
      mr={4}
      src={makeAvatarImageUrl(user.avatarFilename)}
    />
  );
};

export default Avatar;
