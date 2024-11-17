import { Title } from "@solidjs/meta";
import CodeEditor from "~/components/CodeEditor";
import { copyLink } from "~/lib/utils";

export default function Home() {

  return (
    <main>
      <Title>Collaborative Quill Text Editor for SolidJS</Title>
      <h1>Collaborative Quill</h1>
      <h4>Local-first ready text editor</h4>
      
      <p>You can create own collaborative text editors/areas specifying id parameter in the url path. <br></br> Like this index page is actually contains the Editor: <a href="https://editor.krestianstvo.org/editor?k=1" target="_self">https://editor.krestianstvo.org/editor?k=1</a></p>

      <a class="infoText" href="#" onclick={copyLink}>Copy current URL to clipboard for sharing</a>
      <p></p>
      <CodeEditor id="1" />
      <p>
        Visit{" "}
        <a href="https://github.com/NikolaySuslov/solid-braid-quill" target="_blank"> solid-braid-quill
        </a>for the source code.
        <br></br>Built with <a href="https://github.com/NikolaySuslov/solid-braid" target="_blank"> SolidStart & BraidJS
        </a>
      </p>
    </main>
  );
}
