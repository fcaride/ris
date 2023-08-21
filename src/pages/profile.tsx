import { Stack } from "@mui/material";
import { useSession } from "next-auth/react";

import Image from "next/image";
import { SignInButton } from "~/components/SignInButton";

const Profile = () => {
  const { data } = useSession();
  return (
    <Stack>
      {data && <span>Logged in as {data.user?.name}</span>}
      <Image
        src={data?.user.image ?? ""}
        alt="user image"
        className="h-32 w-32 rounded-full"
        width={32}
        height={32}
        unoptimized={true}
      />
      <SignInButton />
    </Stack>
  );
};
export default Profile;
