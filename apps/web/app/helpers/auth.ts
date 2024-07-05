import { auth } from "../utils/auth";

export async function currentUser() {
  const session = await auth();
  const user = session?.user;
  return user;
}
