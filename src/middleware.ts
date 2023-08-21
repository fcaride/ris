import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    if (
      req.nextUrl.pathname.startsWith("/profile") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);
