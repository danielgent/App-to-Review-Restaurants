import React from "react";
import { Avatar as CAvatar } from "@chakra-ui/core";

const makeAvatarImageUrl = (avatarFilename) =>
  avatarFilename.includes("http")
    ? avatarFilename
    : `${process.env.REACT_APP_API_URL}/${avatarFilename}`;

const Avatar = ({ user, ...rest }) => {
  const { avatarFilename, username } = user;
  const avatarImageUrl = avatarFilename
    ? makeAvatarImageUrl(avatarFilename)
    : null;

  return <CAvatar name={username} src={avatarImageUrl} {...rest} />;
};

export default Avatar;
