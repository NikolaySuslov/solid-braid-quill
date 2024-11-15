import { createMiddleware } from "@solidjs/start/middleware";
import { http_server } from 'braid-http'
import braid_text from '~/lib/braid-text/index.js'
import { free_the_cors } from "~/lib/utils.js";

const handler = async (req, res) => {

  if (req.url.includes('/api/braid-text/')) {
    console.log("Req: ", req.url, " - ", req.method)

    free_the_cors(req, res)
    if (req.method === 'OPTIONS') return

    //  Create some initial text for new documents
    if (!(await braid_text.get(req.url, {})).version.length) {
      if (req.url.includes('/api/braid-text/ava')) {
        await braid_text.put(req.url, {
          body:
            JSON.stringify({ a: { n: 1, s: 1 } })
        })
      } else {
        await braid_text.put(req.url, { body: 'This is a fresh blank document, ready for you to edit.' })
      }
    }
    await braid_text.serve(req, res)
  }
}

export default createMiddleware({
  onRequest: [
    async (event) => {
      let req = event.nativeEvent.node.req
      let res = event.nativeEvent.node.res
      await handler(req, res)
    }
  ]
});