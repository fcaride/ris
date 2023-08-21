import { Button } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignInButton = () => {
  const { data: sessionData } = useSession();

  return (
    <Button onClick={sessionData ? () => void signOut() : () => void signIn()}>
      {sessionData ? "Sign out" : "Sign in"}
    </Button>
  );
};
