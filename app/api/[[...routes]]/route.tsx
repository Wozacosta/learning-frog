/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { abi } from "./abi";

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
      <Button.Transaction target="/mint">Mint the NFT</Button.Transaction>,
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

app.transaction("/mint", (c) => {
  const { inputText } = c;
  // Contract transaction response.
  return c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "mint",
    to: "0xf15E9342D00608715BbcD210571C58454880c3FA",
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
