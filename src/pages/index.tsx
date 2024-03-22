import type { GetServerSidePropsContext } from "next";
import { Oval } from "react-loader-spinner";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookies = context.req.cookies;
  const sessionId = cookies.sessionId;
  if (!sessionId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/category?page=1",
        permanent: false,
      },
    };
  }
}
export default function Home() {
  return (
    <>
      <Oval color="#09090B" secondaryColor="#E4E4E7" height={60} width={60} />
    </>
  );
}
