/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { abi } from "./abi";
import { NextResponse } from "next/server";
import { privateKeyToAccount } from "viem/accounts";
import { Hex, createWalletClient, encodeFunctionData, http, parseAbi } from "viem";
import { sepolia } from "viem/chains";
import {
  createSmartAccountClient,
  PaymasterMode,
} from "@biconomy/account";

const privateKey = process.env.PRIVATE_KEY!;
const paymasterApiKey = process.env.PAYMASTER_API_KEY!;

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  console.log("on /");
  // console.log({ENV: process.env})
  return c.res({
    action: "/create_account",
    image: (
      <div
        style={{
          color: "white",
          fontSize: 60,
          marginTop: 30,
        }}
      >
        Deploy customised smart account
      </div>
    ),
    intents: [
      <Button>Create account</Button>,
      <Button.Transaction target="/mint">Mint the NFT</Button.Transaction>,
      <Button.Link href="https://www.youtube.com/watch?v=wDchsz8nmbo">
        Go to the video
      </Button.Link>,
    ],
  });
});

app.frame("/create_account", async (c) => {
  console.log("on /create_account");

  const { frameData } = c;
  const fid = frameData?.fid;
  const messageHash = frameData?.messageHash;

  if (!messageHash) {
    console.log("ABORTING")
    // return new NextResponse("Invalid Frame message", { status: 400 })
    // return c.error({message: "Invalid Frame message", });
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
          ERROR - Invalid Frame message
        </div>
      ),
      intents: [<Button>Go to the next frame</Button>],
    })
  }

  console.log({ fid, messageHash });
  const CHAINID = "11155111"
  
  const bundlerUrl = `https://bundler.biconomy.io/api/v2/${CHAINID}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`

  //@ts-ignore
  const account = privateKeyToAccount(privateKey);
  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });
  const eoa = client.account.address;
  console.log(`EOA address: ${eoa}, connected FID ${fid}`);

  // ------ 2. Create biconomy smart account instance
  const smartAccount = await createSmartAccountClient({
    signer: client,
    bundlerUrl,
    biconomyPaymasterApiKey: paymasterApiKey,
    index: fid,
  });
  const scwAddress = await smartAccount.getAccountAddress();
  console.log("SCW Address", scwAddress);
  
  // console.log({smartAccount})

  const nftAddress = "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e";
  const parsedAbi = parseAbi(["function safeMint(address _to)"]);
  const nftData = encodeFunctionData({
    abi: parsedAbi,
    functionName: "safeMint",
    args: [scwAddress as Hex],
  });
  
  console.log({nftData})

  const userOpResponse = await smartAccount.sendTransaction({
      to: nftAddress,
      data: nftData,
    }, 
    {
      paymasterServiceData: {
        mode: PaymasterMode.SPONSORED,
      },
    }
  );
  const { transactionHash } = await userOpResponse.waitForTxHash();
  console.log("Transaction Hash", transactionHash);

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
        Transaction deployed
      </div>
    ),
    intents: [
      <Button>Go back</Button>,
      <Button.Link href={`https://sepolia.etherscan.io/address/${scwAddress}`}>
        Transaction in explorer 
      </Button.Link>,
    ],
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
