import React from "react";
import { Avatar as CAvatar } from "@chakra-ui/core";

import { makeImageUrl } from "utils";

const Avatar = ({ user, ...rest }) => {
  const { avatarFilename, username } = user;
  const avatarImageUrl = avatarFilename ? makeImageUrl(avatarFilename) : null;

  return <CAvatar name={username} src={avatarImageUrl} {...rest} />;
};

export default Avatar;
