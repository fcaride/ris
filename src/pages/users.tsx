import type { User } from "@prisma/client";
import { Admin } from "~/components/Admin";
import { api } from "~/utils/api";

const Users = () => {
  const { data } = api.user.findMany.useQuery({});

  if (!data) {
    return;
  }
  return <Admin<User> data={data} />;
};

export default Users;
