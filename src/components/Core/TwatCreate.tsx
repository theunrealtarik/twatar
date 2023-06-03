import { api } from "@/common/server/api";
import {
  type FC,
  type FormEventHandler,
  type ChangeEventHandler,
  useState,
  useRef,
  useCallback,
} from "react";
import { Button, GifPicker, IconButton, UserAvatar } from "@/components";
import Image from "next/image";

import { MdOutlineEmojiEmotions } from "react-icons/md";
import { BsFilePlayFill, BsFileImageFill } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import { useFileHandler } from "@/hooks";

interface CreateTwatProps {
  user: IUser | null;
}

const CreateTwat: FC<CreateTwatProps> = ({ user }) => {
  const [attachment, setAttachment] = useState<IAttachment | undefined>(
    undefined
  );

  const [isOpen, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const fileInput = useRef<HTMLInputElement>(null);

  const context = api.useContext();
  const modal = useRef<HTMLDialogElement>(null);
  const image = useFileHandler({ maxFileSize: 3_000_000, onlyImages: true });

  const twat = api.twats.create.useMutation({
    onError: async () => alert("Failed to publish your Twat 🤷‍♂️"),
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
    twat.mutateAsync({ content, attachment }).finally(() => {
      setContent(() => "");
      clearAttachment();
    });
  };

  const fileChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) =>
    image.handler(e, (result, file) => {
      setAttachment(() => ({
        name: file.name ?? "",
        url: result.toString(),
        type: "image",
      }));
    });

  const onOpen = useCallback(
    (state: boolean = true) => {
      setOpen(() => state);
      if (modal.current) {
        modal.current.open = state;
      }
    },
    [isOpen]
  );

  const clearAttachment = useCallback(() => {
    setAttachment(undefined);
  }, [attachment]);

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
          maxLength={300}
          className="min-h-[10px] flex-1 resize-y rounded-lg text-xl shadow-none outline-none dark:bg-black"
        ></textarea>
      </div>

      <div className="inline-flex w-full justify-between gap-x-2 pl-16">
        <div className="relative inline-flex">
          <IconButton type="button" onClick={() => alert("duh?")}>
            <MdOutlineEmojiEmotions size={20} />
          </IconButton>

          <IconButton type="button" onClick={() => onOpen(!isOpen)}>
            <BsFilePlayFill size={16} />
          </IconButton>

          <dialog ref={modal} className="left-10 top-10 z-50 p-0 shadow">
            <GifPicker
              onChoose={(attachment) => {
                setAttachment(() => attachment);
                onOpen(false);
              }}
            />
          </dialog>

          <IconButton type="button" onClick={() => fileInput.current?.click()}>
            <BsFileImageFill size={16} />
          </IconButton>

          <input
            type="file"
            ref={fileInput}
            className="hidden"
            accept=".png, .jpeg, .jpg"
            onChange={fileChangeHandler}
          />
        </div>
        <div className="space-x-4">
          <span>{content.length}/300</span>
          <Button
            type="submit"
            disabled={twat.isLoading || content.length === 0}
          >
            Twat
          </Button>
        </div>
      </div>

      {attachment && attachment.url && (
        <div className="pl-16">
          <div className="relative my-2 h-48 overflow-hidden rounded-lg">
            <IconButton
              onClick={() => clearAttachment()}
              colorScheme="love"
              className="absolute right-2 top-2 z-20 cursor-pointer"
            >
              <FiX size={15} />
            </IconButton>
            <Image
              fill
              src={attachment.url}
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
