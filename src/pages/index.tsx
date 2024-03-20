import { useRouter } from "next/router";
import { Oval } from "react-loader-spinner";

import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <Oval color="#09090B" secondaryColor="#E4E4E7" height={60} width={60} />
    </>
  );
}
