import { MetaProvider, Title } from "@solidjs/meta";
import { Router, Route } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import CodeEditor from "~/routes/code"
import Page from "~/routes/page"
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Collaborative Quill Text Editor for SolidJS</Title>
          <a href="/" target="_self">Index</a>
          <a href="/about" target="_self">About</a>
          {/* <a href={"/editor?k=" + Math.random().toString(36).substr(5)} target="_self">New Editor</a>
          <a href={"/text?k=" + Math.random().toString(36).substr(5)} target="_self">New Textarea</a> */}
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
       <Route path="/editor" component={CodeEditor} />
       <Route path="/text" component={Page} />
      <FileRoutes />
    </Router>
  );
}
