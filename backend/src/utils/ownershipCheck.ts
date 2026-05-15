export const assertOwnership = (resourceUserId: string, reqUserId: string): boolean => {
  return resourceUserId.toString() === reqUserId.toString();
};