import { Input, Textarea, Button } from "@/components";
import { Dialog, Transition } from "@headlessui/react";
import {
  type FC,
  type FormEvent,
  Fragment,
  useReducer,
  useCallback,
} from "react";

import ImageUploadControl from "./fragments/ImageUploadControl";
import { type RouterInputs, api } from "@/common/server/api";

// icons
import { FiEdit } from "react-icons/fi";

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
}

const EditProfile: FC<EditProfileProps> = ({ isOpen, onClose, user }) => {
  const updateProfile = api.user.update.useMutation({
    onError: () => alert("Failed to update your profile"),
  });
  const apiContext = api.useContext();

  const [profile, update] = useReducer(
    (
      state: Partial<RouterInputs["user"]["update"]>,
      action: Partial<RouterInputs["user"]["update"]>
    ) => ({
      ...state,
      ...action,
    }),
    {
      name: user?.name,
      bio: user?.bio,
      image: null,
      banner: null,
    }
  );

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    updateProfile.mutateAsync(profile).finally(() => {
      onClose();
      apiContext.profile.refetch();
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 filter backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border bg-white p-4 text-left align-middle shadow-xl transition-all dark:border-neutral-800 dark:bg-black">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold dark:text-white"
                >
                  Edit Your Profile
                </Dialog.Title>
                <form onSubmit={submitHandler} className="space-y-2">
                  <div aria-label="change avatar/banner">
                    <ImageUploadControl
                      overlayText="click here to edit"
                      overlayClassName="rounded-lg"
                      imageClassName="h-20 bg-gray-200 dark:bg-neutral-600 !rounded-lg"
                      src={profile.banner?.base64 ?? user?.banner ?? null}
                      onChange={(base64, fileName) =>
                        update({
                          banner: {
                            base64,
                            fileName,
                          },
                        })
                      }
                    />
                    <ImageUploadControl
                      className="z-20 -mt-10 ml-4 !w-16 rounded-full ring-2"
                      overlayText={<FiEdit />}
                      imageClassName="h-16 w-16"
                      src={profile.image?.base64 ?? user?.image ?? null}
                      onChange={(base64, fileName) =>
                        update({
                          image: {
                            base64,
                            fileName,
                          },
                        })
                      }
                    />
                  </div>
                  <Input
                    placeholder="your username"
                    className="w-full !rounded-lg"
                    defaultValue={profile.name ?? ""}
                    disabled={updateProfile.isLoading}
                    onChange={(e) => update({ name: e.target.value })}
                  />
                  <Textarea
                    placeholder="your bio"
                    className="max-h-24 w-full !rounded-lg"
                    defaultValue={profile.bio ?? ""}
                    disabled={updateProfile.isLoading}
                    onChange={(e) => update({ bio: e.target.value })}
                  />
                  <div className="inline-flex w-full items-start justify-between">
                    <span className="text-gray-400">
                      {profile.bio ? profile.bio.length : 0}/300
                    </span>
                    <Button disabled={updateProfile.isLoading}>Save</Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditProfile;
