import { userRequests } from "../services/request.service";

export default async function verifyGuard(token) {
  const sync = await userRequests.syncUser(token);
  if (sync.data.user.verified) {
    return true;
  }
  return false;
}
