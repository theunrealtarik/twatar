import { api } from "@/common/server/api";
import {
  type FC,
  type FormEventHandler,
  useState,
  useRef,
  useCallback,
} from "react";
import { Button, GifPicker, IconButton, UserAvatar } from "@/components";

import { MdOutlineEmojiEmotions } from "react-icons/md";
import { AiOutlineGif } from "react-icons/ai";
import Image from "next/image";
import { FiX } from "react-icons/fi";

interface SharePostProps {
  user: IUser | null;
}

const SharePost: FC<SharePostProps> = ({ user }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [gifUrl, setGifUrl] = useState<string | undefined>(undefined);

  const context = api.useContext();
  const modal = useRef<HTMLDialogElement>(null);

  const post = api.posts.create.useMutation({
    onSuccess: async (data) => {
      context.feed.setInfiniteData({}, (cache) => {
        if (!cache || cache.pages.at(0) == null) return;
        if (!user || data == undefined) return;

        return {
          pages: cache.pages.map((page) => ({
            ...page,
            posts: [data, ...page.posts],
          })),
          pageParams: [],
        };
      });
    },
  });

  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (content.length === 0) return;
    post.mutateAsync({ content, gifUrl }).finally(() => setContent(() => ""));
  };

  const onOpen = useCallback(
    (state: boolean = true) => {
      setOpen(() => state);
      if (modal.current) {
        modal.current.open = state;
      }
    },
    [isOpen]
  );

  if (!user) return null;
  return (
    <form
      onSubmit={submitHandler}
      className="space-y-2 border-b border-b-gray-300 p-4 dark:border-b-neutral-600"
    >
      <div className="inline-flex max-h-screen w-full justify-start gap-x-4">
        <UserAvatar size="sm" src={user?.image ?? null} />
        <textarea
          value={content}
          disabled={post.isLoading}
          onChange={(e) => setContent(() => e.target.value)}
          placeholder="wtf is going on ..."
          className="min-h-[10px] flex-1 resize-y text-xl shadow-none outline-none dark:bg-black"
        ></textarea>
      </div>

      <div className="inline-flex w-full justify-between gap-x-2 pl-16">
        <div className="inline-flex">
          <IconButton type="button" onClick={() => alert("duh?")}>
            <MdOutlineEmojiEmotions size={20} />
          </IconButton>
          <div className="relative">
            <IconButton type="button" onClick={() => onOpen(!isOpen)}>
              <AiOutlineGif size={20} />
            </IconButton>

            <dialog ref={modal} className="top-10 z-50 p-0 shadow">
              <GifPicker
                onChoose={(url) => {
                  setGifUrl(() => url);
                  onOpen(false);
                }}
              />
            </dialog>
          </div>
        </div>
        <Button type="submit" disabled={post.isLoading || content.length === 0}>
          Twat
        </Button>
      </div>

      {gifUrl && (
        <div className="pl-16">
          <div className="relative my-2 h-48 overflow-hidden rounded-lg">
            <IconButton
              onClick={() => setGifUrl(undefined)}
              colorScheme="love"
              className="absolute right-2 top-2 z-20 cursor-pointer"
            >
              <FiX size={15} />
            </IconButton>
            <Image
              fill
              src={gifUrl}
              alt="Post Gif"
              className="z-10 bg-gray-200 object-contain dark:bg-neutral-500"
              loading={"lazy"}
              quality={100}
              placeholder="empty"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default SharePost;
