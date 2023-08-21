import { Button, Stack, TextField, Typography } from "@mui/material";
import { useSession } from "next-auth/react";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { SignInButton } from "~/components/SignInButton";
import { api } from "~/utils/api";

const Profile = () => {
  const { data } = useSession();
  const [role, setRole] = useState("user");
  const { mutate } = api.user.setRoleToUser.useMutation({});

  const onChangeRole = () => {
    const email = data?.user?.email;
    if (!email) return;
    mutate({ email, newRole: "user" });
  };

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
      <Stack direction="row">
        <Typography>Role:</Typography>
        <TextField
          value={role}
          onChange={(
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => setRole(event.target.value)}
        />
        <Button onClick={onChangeRole}>Save Role</Button>
      </Stack>
      <SignInButton />
    </Stack>
  );
};
export default Profile;
