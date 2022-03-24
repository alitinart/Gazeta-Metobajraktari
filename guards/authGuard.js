import { userRequests } from "../services/request.service";

export default async function authGuard(token) {
  const sync = await userRequests.syncUser(token);
  if (sync.data) {
    return true;
  }
  return false;
}
