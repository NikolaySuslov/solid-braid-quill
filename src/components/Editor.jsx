import { createResource, createEffect } from "solid-js";
//import { fetch } from 'braid-http'
import simpleton_client from '~/lib/simpleton-client'
import { diff, apply_patches_and_update_selection } from "~/lib/utils";

export default function Editor(props) {

  let texty;
  let url = "/api/braid-text/" + props.id

  const [simpleton] = createResource(async () => {

    const response = await simpleton_client(url, undefined, {
      apply_remote_update: ({ state, patches, version }) => {
        console.log(JSON.stringify(patches), version)
        if (state !== undefined) texty.value = state;
        else apply_patches_and_update_selection(texty, patches);
        return texty.value;
      },
      generate_local_diff_update: (prev_state) => {
        var patches = diff(prev_state, texty.value);
        if (patches.length === 0) return null;
        return { patches, new_state: texty.value };
      },
      on_error: (e) => {
        texty.disabled = true
        texty.style.background = '#fee'
        texty.style.border = '4px solid red'
      }
    })
    return response
  })

  // const result = (msg) => { console.log(msg) }
  // const [braid] = createResource(async () => {
  //   const response = await fetch(url, { subscribe: true }).then(
  //     res => res.subscribe(
  //       update => result('Read 1 ' + JSON.stringify(update) + '!'),
  //       (e) => {
  //         result('Read 1 connection died')
  //         console.log('Try again 1', e)
  //         //setTimeout(read_test1, 1000)
  //       }
  //     )).catch(e => {
  //       result('Read 1 connection died')
  //       console.log('Try again 1', e)
  //       //setTimeout(read_test1, 1000)
  //     });
  //   //(console.log(response.json()))
  //   return await response //(await response.json());
  // });

  return (
    <div>
      <Show when={simpleton()}>
        <textarea
          ref={texty}
          value=""
          id="texty"
          oninput={simpleton()?.changed}
          style="width: 100%; min-height: 200px; box-sizing: border-box; font-size: xx-large; field-sizing: content;"
        ></textarea></Show>
    </div>
  );
}
