import { Redirect } from "@docusaurus/router";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Home() {
  const to = useBaseUrl("/intro");
  return <Redirect to={to} />;
}
