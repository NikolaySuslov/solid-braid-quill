import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <main2>
      <Title>About</Title>
      <h1>About</h1>
      <h4>
      You can create collaborative text areas specifying id parameter in the url path.<br></br> Quill editor use <b>/code?k=id </b>
      {/* <a href="https://editor.krestianstvo.org/editor?k=id" target="_blank">https://editor.krestianstvo.org/editor?k=id </a>  */}
      <br></br>
      Simple text area use <b>/text?k=id</b> 
      {/* <a href="https://editor.krestianstvo.org/text?k=id" target="_blank">https://editor.krestianstvo.org/text?k=id </a> */}
      </h4>

    </main2>
  );
}
