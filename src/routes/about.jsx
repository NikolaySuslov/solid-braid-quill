import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <main2>
      <Title>About</Title>
      <h1>About</h1>
      <h4>
      You can create collaborative text areas specifying parameter in the url path.<br></br> Quill editor use <b>/code?k=myCode </b>
      {/* <a href="https://editor.krestianstvo.org/editor?k=myCode" target="_blank">https://editor.krestianstvo.org/editor?k=myCode </a>  */}
      <br></br>
      Simple text area use <b>/text?k=myText</b> 
      {/* <a href="https://editor.krestianstvo.org/text?k=myCode" target="_blank">https://editor.krestianstvo.org/text?k=myText </a> */}
      </h4>

    </main2>
  );
}
