import { sequence } from "0xsequence";
import {
  goerli,
  polygon,
  mainnet,
  polygonMumbai,
  Chain,
} from "@wagmi/core/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import Image from "next/image";
import { useContext, useState } from "react";
import { useConnect } from "wagmi";
import { configureChains, Connector, createConfig, WagmiConfig } from "wagmi";

import { ModalContext } from "@/lib/context";
import { GloSequenceConnector } from "@/lib/sequence-connector";

import { isProd } from "../../lib/utils";

export default function UserAuthModal() {
  const { connect, connectors } = useConnect();
  const { closeModal } = useContext(ModalContext);
  const [sendForm, setSendForm] = useState({
    email: "",
  });

  const signInWithEmail = async () => {
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      isProd() ? ([polygon, mainnet] as Chain[]) : [polygonMumbai, goerli],
      [publicProvider()]
    );
    const emailConnector = new GloSequenceConnector({
      options: {
        connect: {
          app: "Glo wallet",
          networkId: chains[0].id,
          askForEmail: true,
          settings: {
            theme: "light",
            bannerUrl: "https://i.imgur.com/P8l8pFh.png",
            signInWithEmail: sendForm.email,
          },
        },
      },
      chains,
    });
    connect({ connector: emailConnector });
    closeModal();
  };

  return (
    <>
      <section className="pt-0 p-8 flex flex-col items-center">
        <Image
          className="absolute top-[-50px] border-2 rounded-full border-cyan-600"
          src="/jeff.svg"
          alt="glo logo"
          width={100}
          height={100}
        />
        <h1 className="">👋 Hey it’s Jeff</h1>
        <p className="copy text-xl">
          Thanks for being part of the Glo movement!
        </p>
      </section>
      <section className="p-8 rounded-b-3xl bg-pine-100 after:bg-pine-100">
        <h2 className="flex justify-center">Sign up</h2>
        <div>
          <div className="p-0 form-group flex justify-center">
            <div className="input-container inline">
              <input
                id="sign-in-with-email"
                placeholder={"Email"}
                value={sendForm.email}
                onChange={(e) =>
                  setSendForm({ ...sendForm, email: e.target.value })
                }
              />
              <button
                className="right-0 primary-button"
                onClick={() => signInWithEmail()}
              >
                Submit
              </button>
            </div>
          </div>
          <button
            className="auth-button"
            onClick={() => {
              connect({ connector: connectors[0] });
              closeModal();
            }}
          >
            Social Login
          </button>

          <button
            className="auth-button"
            onClick={() => {
              connect({ connector: connectors[1] });
              closeModal();
            }}
          >
            Metamask
          </button>

          <button
            className="auth-button"
            onClick={() => {
              connect({ connector: connectors[2] });
              closeModal();
            }}
          >
            WalletConnect
          </button>
        </div>
      </section>
    </>
  );
}
