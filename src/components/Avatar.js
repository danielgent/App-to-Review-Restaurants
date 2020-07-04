import React from "react";
import { Avatar as CAvatar } from "@chakra-ui/core";

const makeAvatarImageUrl = (avatarFilename) =>
  avatarFilename.includes("http")
    ? avatarFilename
    : `${process.env.REACT_APP_API_URL}/${avatarFilename}`;

const Avatar = ({ user }) => {
  const { avatarFilename, username } = user;
  const avatarImageUrl = avatarFilename
    ? makeAvatarImageUrl(avatarFilename)
    : null;

  return <CAvatar name={username} mr={4} src={avatarImageUrl} />;
};

export default Avatar;
