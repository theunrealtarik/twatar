import { api } from "@/common/server/api";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

import Input from "../UI/Input";
import Button from "../UI/Button";

interface CreateCommentProps {
  twatId: string;
}

const CreateComment: React.FC<CreateCommentProps> = ({ twatId }) => {
  const [content, setContent] = useState<string>("");

  const createComment = api.comments.create.useMutation({
    onError: () => alert("Your opinion sucks"),
  });

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    createComment
      .mutateAsync({
        content,
        tid: twatId,
      })
      .then(() => setContent(""));
  };

  return (
    <div className="w-full space-y-2 py-4">
      <form className="space-y-2" onSubmit={submitHandler}>
        <Input
          className="w-full !rounded-lg"
          placeholder="give your pointless opinion"
          maxLength={200}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={createComment.isLoading}
        />
        <div className="flex justify-end space-x-2">
          <span>{content.length}/200</span>
          <Button disabled={createComment.isLoading || content.length === 0}>
            Comment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateComment;
