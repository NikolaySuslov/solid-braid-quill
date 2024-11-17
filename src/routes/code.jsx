import { Title } from "@solidjs/meta";
import { useParams, useSearchParams } from "@solidjs/router";
import CodeEditor from "~/components/CodeEditor";
import { copyLink } from "~/lib/utils";


export default function Page() {

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <main>
      <Title>Editor</Title>
      <h1>Editor {searchParams.k}</h1>
      <a class="infoText" href="#" onclick={copyLink}>Copy current URL to clipboard for sharing</a>
      <p />
      <CodeEditor id={searchParams.k} />
    </main>
  );
}
