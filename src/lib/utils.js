import { diff_main } from "~/lib/myers-diff1";

export function diff(before, after) {
    let diff = diff_main(before, after);
    let patches = [];
    let offset = 0;
    for (let d of diff) {
        let p = null;
        if (d[0] == 1) p = { range: [offset, offset], content: d[1] };
        else if (d[0] == -1) {
            p = { range: [offset, offset + d[1].length], content: "" };
            offset += d[1].length;
        } else offset += d[1].length;
        if (p) {
            p.unit = "text";
            patches.push(p);
        }
    }
    return patches;
}

export function apply_patches_and_update_selection(textarea, patches) {

    let offset = 0;
    for (let p of patches) {
        p.range[0] += offset;
        p.range[1] += offset;
        offset -= p.range[1] - p.range[0];
        offset += p.content.length;
    }

    let original = textarea.value;
    let sel = [textarea.selectionStart, textarea.selectionEnd];

    for (var p of patches) {
        let range = p.range;

        for (let i = 0; i < sel.length; i++)
            if (sel[i] > range[0])
                if (sel[i] > range[1]) sel[i] -= range[1] - range[0];
                else sel[i] = range[0];

        for (let i = 0; i < sel.length; i++)
            if (sel[i] > range[0]) sel[i] += p.content.length;

        original =
            original.substring(0, range[0]) +
            p.content +
            original.substring(range[1]);
    }

    textarea.value = original;
    textarea.selectionStart = sel[0];
    textarea.selectionEnd = sel[1];
}

export function apply_patches_and_update_selectionQ(textarea, patches) {

    let offset = 0;
    for (let p of patches) {
        p.range[0] += offset;
        p.range[1] += offset;
        offset -= p.range[1] - p.range[0];
        offset += p.content.length;
    }

    let original = textarea.getText()//.replace(/\n$/, "")
    const qrange = textarea.getSelection();
    let sel = [qrange.index, qrange.index + qrange.length];

    for (var p of patches) {
        let range = p.range;

        for (let i = 0; i < sel.length; i++)
            if (sel[i] > range[0])
                if (sel[i] > range[1]) sel[i] -= range[1] - range[0];
                else sel[i] = range[0];

        for (let i = 0; i < sel.length; i++)
            if (sel[i] > range[0]) sel[i] += p.content.length;

        original =
            original.substring(0, range[0]) +
            p.content +
            original.substring(range[1]);
    }

    textarea.setText(original, 'silent');
    textarea.setSelection(sel[0], (sel[1] - sel[0]), 'silent')

}

export function free_the_cors(req, res) {
    res.setHeader('Range-Request-Allow-Methods', 'PATCH, PUT')
    res.setHeader('Range-Request-Allow-Units', 'json')
    res.setHeader("Patches", "OK")
    var free_the_cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, HEAD, GET, PUT, UNSUBSCRIBE",
        "Access-Control-Allow-Headers": "subscribe, client, version, parents, merge-type, content-type, content-range, patches, cache-control, peer"
    }
    Object.entries(free_the_cors).forEach(x => res.setHeader(x[0], x[1]))
    if (req.method === 'OPTIONS') {
        res.writeHead(200)
        res.end()
    }
}

export const braidTestJSONHandler = (req, res) => {

    if (req.subscribe)
        res.startSubscription()

    // Send the current version
    res.sendUpdate({
        version: ['test'],
        parents: ['oldie'],
        body: JSON.stringify({ this: 'stuff' })
    })

    if (req.subscribe) {
        // Send a patch
        res.sendUpdate({
            VersiOn: ['test1'],             // Upper/lowercase is ignored
            ParEnts: ['oldie', 'goodie'],
            patch: { unit: 'json', range: '[1]', content: '1' },
            hash: '42',
            ':status': '115'
        })

        // Send a patch as array
        res.sendUpdate({
            Version: ['test2'],
            patch: { unit: 'json', range: '[2]', content: '2' }
        })

        // Send two patches as array
        res.sendUpdate({
            version: ['test3'],
            patches: [{ unit: 'json', range: '[3]', content: '3', hash: '43' },
            { unit: 'json', range: '[4]', content: '4' }]
        })

    }

}

export async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      console.log('Link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }