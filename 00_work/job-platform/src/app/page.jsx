"use client";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const cookies = parseCookies();
  const router = useRouter();
  useEffect(() => {
    if (cookies?.accessToken) router.replace("/jobs");
    else router.replace("/login");
  }, []);

  return <></>;
}
