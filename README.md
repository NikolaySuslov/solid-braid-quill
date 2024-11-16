# Collaborative Quill Text Editor for SolidJS

This is a demo application of using [SolidStart & BraidJS](https://github.com/NikolaySuslov/solid-braid) for developing local-first, collaborative serverless applications in [SolidJS](https://docs.solidjs.com/).     

Glad to [SolidStart](https://start.solidjs.com/) fullstack platform, augmentation of the [Quill](https://quilljs.com/) text editor with collaborative features does not require running of any external services for state synchronisation. Even more, by utilizing the [Braid-HTTP protocol](https://github.com/braid-org), it does not even require any WebSockets connections. Solid-Braid interconnection shows in this demo application, how easily such collaborative applications could be implemented and deployed.  

![](/public/demo.gif)

### Demo app is running at https://editor.krestianstvo.org

To run the demo locally:

1. Clone this repo: ```git clone https://github.com/NikolaySuslov/solid-braid-quill```
2. Start the SoliStart local server with ```npm run dev```
3. Open web browser with an url: http://localhost:3000
4. Open another instance of web browser with the same url
5. In the textarea enter any text and observe it's synchronisation

You can create isolated collaborative text areas specifying parameter in the url, like:  
http://localhost:3000/editor?k=myText

**Notes:** By defualt 1-2 Web browser windows or tabs running the demo per device should be ok. Google Chrome has a limit of Max parallel HTTP connections in a browser. So, if you have reached the maximum number of concurrent connections per host (browser suspensed). You should either keep less tabs open or increase the number of connection in your browser. On Firefox, you can tweak the preference network.http.max-persistent-connections-per-server in the about:config page.
 

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

This project was created with the [Solid CLI](https://solid-cli.netlify.app)

## Contributing & License

MIT license


