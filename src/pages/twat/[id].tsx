import { withSession } from "@/common/middlewares";
import { api } from "@/common/server/api";

import { AppLayout } from "@/layouts";
import { CommentCard, CreateComment, Loading, TwatCard } from "@/components";

import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useScroll } from "@/hooks";
import { useEffect } from "react";

interface TwatPageProps {
  user: IUser;
}

const TwatPage: NextPage<TwatPageProps> = ({ user }) => {
  const router = useRouter();
  const scrollPos = useScroll();
  const twatId = router.query.id as string;

  const twat = api.twats.get.useQuery({ tid: twatId });
  const listComments = api.comments.all.useInfiniteQuery(
    { tid: twatId },
    {
      onError: () => console.error("Failed to retrieve Twat comments"),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    if (
      scrollPos > 90 &&
      listComments.hasNextPage &&
      !listComments.isFetching
    ) {
      listComments.fetchNextPage();
    }
  });

  if (twat.isLoading && !listComments.data) {
    return <Loading />;
  }

  const comments = listComments.data?.pages.flatMap((page) => page.comments);

  return (
    <AppLayout hideHeader={true} user={user}>
      <div className="divide-y-gray-300 divide-y p-4 dark:divide-neutral-600 ">
        {twat.data && (
          <TwatCard link={false} lineClamp={false} data={twat.data} />
        )}
        <CreateComment twatId={twatId} />
        <div className="space-y-6 py-4">
          {comments?.map((comment) => (
            <CommentCard key={comment.id} data={comment} />
          ))}
        </div>
        <div className="mx-auto">{listComments.isFetching && <Loading />}</div>
      </div>
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(false);

export default TwatPage;
