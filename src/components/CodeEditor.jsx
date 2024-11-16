import { createResource, createEffect, onMount, onCleanup } from "solid-js";
import { createStore, reconcile, produce } from "solid-js/store";
import { fetch as braid_fetch } from 'braid-http'
import simpleton_client from '~/lib/simpleton-client'
import { diff, apply_patches_and_update_selectionQ } from "~/lib/utils";
import Quill from "quill";
import { Range as QRange } from 'quill/core/selection.js';
import { SolidQuill } from "solid-quill";
import "quill/dist/quill.snow.css";
import "./CodeEditor.css"
import QuillCursors from 'quill-cursors';

Quill.register('modules/cursors', QuillCursors);

const COLORS = ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff'];
const SIZES = ['small', false, 'large', 'huge'];

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function CodeEditor(props) {

  let me = Math.random().toString(36).substr(2)

  const [store, setStore] = createStore({
    userCount: 0,
    users: {
      [me]: {
        id: me,
        color: getRandomColor()
      }
    }
  })

  createEffect(() => {
    Object.keys(store.users).forEach(key => {
      console.log("new avatar ", store.users[key])
    })
  })

  let q;
  let urlID = props.id ? props.id : "index"
  let url = "/api/braid-text/" + props.id
  let ava_url = "/api/braid-text/ava-" + props.id

  const checkAvatar = (version, color) => {

    if (version !== undefined) {
      let col = color ? color : 'red'
      let av = version[0].split('-')[0];

      setStore(
        produce((state) => {
          let aa = state.users[av]
          if (aa == undefined) {
            let cur = q.getModule('cursors');
            cur.createCursor(av, av, col);
            state.users[av] =
            {
              id: av,
              color: col,
              cursor: cur
            }
          }
        })
      )
    }
  }


  const [obj] = createResource(async () => {
    const response = await simpleton_client(ava_url, me, {
      apply_remote_update: ({ state, patches, version }) => {
        console.log(JSON.stringify(patches), version)
        if (patches && patches[0]) {
          let content = JSON.parse(patches[0].content).a
          let cur = store.users[content.n]
          let ra = (new QRange(content.s, (content.l ? content.l : 0)))
          if (cur) {
            cur.cursor.toggleFlag(content.n, true)
            cur.cursor.moveCursor(content.n, ra)
          }
          else {
            if (content.a == 'md') {
              checkAvatar([content.n], content.c)
            }
          }

          switch (content.a) {
            case "bold":
              q.formatText(ra.index, ra.length, 'bold', (q.getFormat().bold ? false : true));
              break;
            case 'italic':
              q.formatText(ra.index, ra.length, 'italic', (q.getFormat().italic ? false : true));
              break;
            case 'underline':
              q.formatText(ra.index, ra.length, 'underline', (q.getFormat().underline ? false : true));
              break;
            case 'strike':
              q.formatText(ra.index, ra.length, 'strike', (q.getFormat().strike ? false : true));
              break;
            default:
              break;
          }
        }

        return JSON.stringify({});
      },
      generate_local_diff_update: (prev_state) => {
        // var patches = diff(prev_state, q.getText());
        // if (patches.length === 0) return null;
        // return { patches, new_state: q.getText() };
      },
      content_type: "application/json",
      on_error: (e) => {
      }
    })
    return response
  })

  const [simpleton] = createResource(async () => {
    const response = await simpleton_client(url, me, {
      apply_remote_update: ({ state, patches, version }) => {
        console.log(JSON.stringify(patches), version)
        //checkAvatar(version)
        if (state !== undefined) {
          q.setText(state, 'silent')
        }
        else {
          console.log('PAT ', patches)
          if (patches[0]) {
            let av = version ? version[0].split('-')[0] : me
            let cur = store.users[av] // ? store.users[av] : checkAvatar(av)
            console.log("set ", patches)
            q.focus({ preventScroll: true });
            apply_patches_and_update_selectionQ(q, patches)
            q.blur();
            if (cur && patches[0]) {
              const cursorPos =
                (patches[0].content == "") ||
                  ((typeof patches[0].content == Uint8Array) &&
                    patches[0].content.length == 0
                  )
                  ? patches[0].range[0] : patches[0].range[0] + 1;
              let ra = (new QRange(cursorPos, 0))
              cur.cursor.toggleFlag(av, true)
              cur.cursor.moveCursor(av, ra)
            }
          }
        };
        return q.getText().replace(/\n$/, "")
      },
      generate_local_diff_update: (prev_state) => {
        let rl = q.getText().replace(/\n$/, "")
        var patches = diff(prev_state, rl);
        if (patches.length === 0) return null;
        return { patches, new_state: rl };
      },
      on_error: (e) => {
        // texty.disabled = true
        // texty.style.background = '#fee'
        // texty.style.border = '4px solid red'
      }
    })
    return response
  })

  onMount(() => {
    console.log(q);

    window.addEventListener("beforeunload", async () => {
      await fetch(ava_url, {
        method: 'PUT',
        headers: { 'Content-Range': 'json a' },
        body: JSON.stringify({ a: 'end', n: me })
      })
    })
    // const keyboard = q.getModule('keyboard');
    // delete keyboard.bindings['Enter']; // HERE clear all Enter bindings

//     q.keyboard.addBinding({
//       key: 13,  // Enter key
//       //shiftKey: true
//     }, async function (range, context) {
//        q.insertText(range.index, '\n');
//        //q.setSelection(range.index + 1);
// return true
//     });

    q.keyboard.addBinding({
      key: 39,  // Right key
    }, async function (range, context) {
      q.setSelection(range.index + 1);
      let s = q.getSelection()
      await fetch(ava_url, {
        method: 'PUT',
        headers: { 'Content-Range': 'json a' },
        body: JSON.stringify({ a: 'right', n: me, s: s.index })
      })
    });

    q.keyboard.addBinding({
      key: 37,  // Right key
    }, async function (range, context) {
      q.setSelection(range.index - 1);
      let s = q.getSelection()
      await fetch(ava_url, {
        method: 'PUT',
        headers: { 'Content-Range': 'json a' },
        body: JSON.stringify({ a: 'left', n: me, s: s.index })
      })
    });
  });

  const handleMouseDown = async (e) => {

    let s = q.getSelection()
    if (s) {
      await fetch(ava_url, {
        method: 'PUT',
        headers: { 'Content-Range': 'json a' },
        body: JSON.stringify({ a: 'md', n: me, s: s.index, l: s.length, c: store.users[me].color })
      })
    }
  }

  const textFormat = async (format) => {
    console.log(format)
    let s = q.getSelection()
    if (s) {
      await fetch(ava_url, {
        method: 'PUT',
        headers: { 'Content-Range': 'json a' },
        body: JSON.stringify({ a: format, n: me, s: s.index, l: s.length })
      })
    }
  }

  const init = (quill) => {
    setStore(
      produce((state) => {
        let aa = state.users[me]
        if (aa !== undefined) {
          let cur = q.getModule('cursors');
          cur.createCursor(me, me, aa.color);
          state.users[me].cursor = cur
        }
      })
    )

    const toolbar = q.getModule('toolbar');
    toolbar.addHandler('bold', () => { textFormat('bold') });
    toolbar.addHandler('italic', () => { textFormat('italic') });
    toolbar.addHandler('underline', () => { textFormat('underline') });
    toolbar.addHandler('strike', () => { textFormat('strike') });
  };

  let formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "list",
    "indent",
    "size",
    "header",
    "link",
    "image",
    "video",
    "color",
    "background"
  ]

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      // [{ 'color': [] }, { 'background': [] }], 

      // [{ align: [] }],
      // [{ list: "ordered" }, { list: "bullet" }],
      // [{ indent: "-1" }, { indent: "+1" }],

      // [{ size: ["small", false, "large", "huge"] }],
      // [{ header: [1, 2, 3, 4, 5, 6, false] }]
    ],
    clipboard: {
      matchVisual: false,
    },
    cursors: {
      transformOnTextChange: true
    },
  }

  return (
    <>
      <Show when={simpleton()}>
        <SolidQuill
          // Bind the `Quill` instance to the parent
          ref={q}
          id="q"
          // Which element to create (default to `div`)
          as="main"
          // Events
          onReady={init}
          onclick={handleMouseDown}
          //onInput={simpleton()?.changed}
          onTextChange={simpleton()?.changed} //{() => console.log(q.getText())}
          onSelectionChange={(range) => {
            //console.log("ran: ", range)
            let myav = store.users[me]
            if (myav && myav.cursor) {
              myav.cursor.moveCursor(me, range)
            }
            //cursorsOne.moveCursor('cursor', range)
          }}
          //onEditorChange={console.log}
          // Quill options
          debug={false}
          modules={modules}
          // modules={} // see defaults below
          formats={formats} // see defaults below
          placeholder=""
          readOnly={false} // for now this is the only reactive props
          theme="snow"
          // bounds={}
          // scrollingContainer={}
          // strict={}
          // All other props will be attached to the rendered
          // dom element, so you can add classes, styles, w/e
          class="quill"
          //style="transform: rotate(90deg)"
          classList={{ active: true }}
        />
      </Show>
    </>
  );
}
