import { createElement } from "react";
import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { BiLogoGmail } from "react-icons/bi";

import {
  SocialContactSingleType,
  SOCIAL_CONTACT,
} from "../constants/contact.constant";

export const SocialContact = (name: SocialContactSingleType) => {
  switch (name) {
    case "linkedin":
      return {
        icons: createElement(AiFillLinkedin),
      };
    case "github":
      return {
        icons: createElement(AiFillGithub),
      };
    case "email":
      return {
        icons: createElement(BiLogoGmail),
      };
  }
};

export const SocialContactList = () => {
  return SOCIAL_CONTACT.map((item: SocialContactSingleType) =>
    SocialContact(item)
  );
};
