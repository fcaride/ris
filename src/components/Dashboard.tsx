import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { grey } from "@mui/material/colors";
import * as React from "react";
import { Drawer } from "./Drawer";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row">
      <CssBaseline />
      <Drawer />
      <Box
        component="main"
        sx={{
          backgroundColor: grey[100],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Stack>
  );
}
