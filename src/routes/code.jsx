import { Title } from "@solidjs/meta";
import { useParams, useSearchParams } from "@solidjs/router";
import CodeEditor from "~/components/CodeEditor";

export default function Page() {

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <main>
      <Title>Editor</Title>
      <h1>Editor {searchParams.k}</h1>
      <a href={window.location.href} target="_blank">Open this editor in new tab</a>
      <p />
      <CodeEditor id={searchParams.k} />
    </main>
  );
}
