import NextAuth from "next-auth";
import { authOptions } from "@/common/server/auth";

export default NextAuth(authOptions);
