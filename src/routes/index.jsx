import { Title } from "@solidjs/meta";
import CodeEditor from "~/components/CodeEditor";

export default function Home() {

  return (
    <main>
      <Title>Collaborative Quill Text Editor for SolidJS</Title>
      <h1>Collaborative Quill</h1>
      <h4>Local-first ready text editor</h4>
      <a class="infoText" href={window.location.href} target="_blank">Open this editor in the new tab</a>
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
