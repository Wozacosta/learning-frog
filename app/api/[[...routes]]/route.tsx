/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  return c.res({
    action: "/second",
    image: (
      <div
        style={{
          color: "white",
          fontSize: 60,
          marginTop: 30,
        }}
      >
        This is our first frame
      </div>
    ),
    intents: [
      <Button>Go to the next frame</Button>,
      <Button.Link href="https://www.youtube.com/watch?v=wDchsz8nmbo">
        Go to the video
      </Button.Link>,
    ],
  });
});

app.frame("/second", (c) => {
  return c.res({
    action: "/",
    image: (
      <div
        style={{
          color: "white",
          fontSize: 60,
          marginTop: 30,
        }}
      >
        This is our second frame
      </div>
    ),
    intents: [<Button>Go to the next frame</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
