import { redirect } from "@/common/lib/utils";
import { NextPage } from "next";

const SearchPage: NextPage = ({}) => {
  return null;
};

export const getServerSideProps = () => {
  return redirect("/search/twats");
};
export default SearchPage;
