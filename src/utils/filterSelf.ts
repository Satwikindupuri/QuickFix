import { User } from "firebase/auth";

export function filterSelfProviders(list: any[], user: User | null) {
  if (!user) return list;
  return list.filter((p) => p.uid !== user.uid);
}
