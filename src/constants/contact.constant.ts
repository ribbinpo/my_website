export const SOCIAL_CONTACT = ["linkedin", "github", "email"] as const;

export type SocialContactSingleType = typeof SOCIAL_CONTACT[number];
