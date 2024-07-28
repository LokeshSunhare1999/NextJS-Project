import React from "react";
import AuthForm from "@/components/ui/AuthForm";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const SignUp = async () => {
  const loggedInUSer = await getLoggedInUser();
  console.log("loggedInUSer", loggedInUSer);
  console.warn("loggedInUSer", loggedInUSer);

  return (
    <section className="flex-center size-full max-sm:px-6 ">
      <AuthForm type="sign-up" />
    </section>
  );
};

export default SignUp;
