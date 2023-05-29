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

interface CreateTwatProps {
  user: IUser | null;
}

const CreateTwat: FC<CreateTwatProps> = ({ user }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [gifUrl, setGifUrl] = useState<string | undefined>(undefined);

  const context = api.useContext();
  const modal = useRef<HTMLDialogElement>(null);

  const twat = api.twats.create.useMutation({
    onSuccess: async (data) => {
      context.feed.setInfiniteData({}, (cache) => {
        if (!cache || cache.pages.at(0) == null) return;
        if (!user || data == undefined) return;

        return {
          pages: cache.pages.map((page) => ({
            ...page,
            twats: [data, ...page.twats],
          })),
          pageParams: [],
        };
      });
    },
  });

  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (content.length === 0) return;
    twat.mutateAsync({ content, gifUrl }).finally(() => {
      setContent(() => "");
      setGifUrl(undefined);
    });
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
          disabled={twat.isLoading}
          onChange={(e) => setContent(() => e.target.value)}
          placeholder="wtf is going on ..."
          className="min-h-[10px] flex-1 resize-y rounded-lg text-xl shadow-none outline-none dark:bg-black"
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
        <Button type="submit" disabled={twat.isLoading || content.length === 0}>
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
              alt="Twat Gif"
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

export default CreateTwat;
