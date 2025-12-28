"use client";
import { Suspense, useContext } from "react";
import PostJobPageComponent from "./_components/PostJobPageComponent";

const PostJob = () => {
  return (
    <Suspense fallback={<div></div>}>
      <PostJobPageComponent />
    </Suspense>
  );
};

export default PostJob;
