import { Chain, FetchBalanceResult } from "@wagmi/core";
import {
  celo,
  celoAlfajores,
  goerli,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonMumbai,
} from "@wagmi/core/chains";
import { BigNumber, ethers } from "ethers";

import {
  defaultChainId,
  getChainRPCUrl,
  getSmartContractAddress,
} from "@/lib/config";
import { getAllowedChains } from "@/lib/utils";

const TOTAL_DAYS = 365;
const ANNUAL_INTEREST_RATE = 0.024;

export const getTotalYield = (amount: number): number => {
  return (amount * ANNUAL_INTEREST_RATE * TOTAL_DAYS) / 365;
};

// descending order of cost
// multiplying every item by 1.11 because givedirectly is only 90% efficient with the yield received
const possibleImpactItems = [
  {
    description: "20 litres of water",
    cost: 0.03 * 1.11,
    emoji: "🚰",
  },
  {
    description: "kg of maize",
    cost: 0.95 * 1.11,
    emoji: "🌽",
  },
  {
    description: "School textbook",
    cost: 1.22 * 1.11,
    emoji: "📚",
  },
  {
    description: "School uniform",
    cost: 3.24 * 1.11,
    emoji: "🧑‍🏫",
  },
  {
    description: "Farm chicken",
    cost: 12 * 1.11,
    emoji: "🐔",
  },
  {
    description: "Fishing net",
    cost: 100 * 1.11,
    emoji: "🎣",
  },
  {
    description: "Saanen dairy goat",
    cost: 121 * 1.11,
    emoji: "🐐",
  },
  {
    description: "Inventory to start a kiosk",
    cost: 162 * 1.11,
    emoji: "🏪",
  },
  {
    description: "Dairy cow",
    cost: 200 * 1.11,
    emoji: "🐄",
  },
  {
    description: "House building materials",
    cost: 227 * 1.11,
    emoji: "🧱",
  },
  {
    description: "80 m² of farm land",
    cost: 300 * 1.11,
    emoji: "🌱",
  },
  {
    description: "Person out of extreme poverty",
    // 480 already takes into account givedirectly inefficiency figure
    cost: 480,
    emoji: "🧑",
  },
].sort((item1, item2) => item2.cost - item1.cost);

export interface GetImpactItem {
  description: string;
  cost: number;
  emoji: string;
  count?: number;
  idx?: number;
}
export const getImpactItems = (amount: number): GetImpactItem[] => {
  const impactItems = [];
  for (let idx = 0; amount > 0 && idx < possibleImpactItems.length; idx++) {
    const possibleImpactItem = possibleImpactItems[idx];
    if (amount >= possibleImpactItem.cost) {
      const itemCount = Math.floor(amount / possibleImpactItem.cost);
      impactItems.push({ ...possibleImpactItem, count: itemCount, idx: idx });
    }
  }
  return impactItems;
};

export const isLiftPersonOutOfPovertyImpactItem = (
  impactItem: GetImpactItem
): boolean => {
  return impactItem.description === "Person out of extreme poverty";
};

export const getUSFormattedNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const TIER_SUFFIX = ["", "K", "M", "B", "T"];
export const getNiceNumber = (num: number) => {
  const base = getUSFormattedNumber(num);

  const parts = base.split(",");
  const decimals = parts.length > 1 ? parts[1][0] : 0;
  return `${parts[0]}.${decimals}${TIER_SUFFIX[parts.length - 1]}`;
};

export const getUSDCContractAddress = (chain: Chain): `0x${string}` => {
  const chainId = chain?.id || defaultChainId();
  switch (chainId) {
    case goerli.id: {
      return "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
    }
    case mainnet.id: {
      return "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    }
    case celo.id: {
      return "0xef4229c8c3250C675F21BCefa42f58EfbfF6002a";
    }
    case celoAlfajores.id: {
      return "0x5263F75FFB7384690818BeAEa62D7313B69f2A9c";
    }
    case polygonMumbai.id: {
      return "0xF493Af87835D243058103006e829c72f3d34b891";
    }
    case optimism.id: {
      return "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
    }
    case optimismSepolia.id: {
      return "0xe05606174bac4a6364b31bd0eca4bf4dd368f8c6";
    }
    case polygon.id:
    default: {
      return "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    }
  }
};

export const getUSDCToUSDGLOSwapDeeplink = (
  amount: number,
  chain: Chain,
  dex: string
): string => {
  const chainAllowed = getAllowedChains().some(
    (allowedChain) => allowedChain.id === chain?.id
  );
  if (!chainAllowed) {
    return "";
  }

  const inputCurrency = getUSDCContractAddress(chain);
  let outputCurrency, swapChain;

  switch (chain.id) {
    case mainnet.id: {
      outputCurrency = getSmartContractAddress(mainnet.id);
      swapChain = dex === "Uniswap" ? "mainnet" : "ethereum";
      break;
    }
    case goerli.id: {
      outputCurrency = getSmartContractAddress(goerli.id);
      swapChain = dex === "Uniswap" ? "goerli" : "ethereum";
      break;
    }
    case celo.id: {
      outputCurrency = getSmartContractAddress(celo.id);
      swapChain = "celo";
      break;
    }
    case celoAlfajores.id: {
      outputCurrency = getSmartContractAddress(celoAlfajores.id);
      swapChain = dex === "Uniswap" ? "celo_alfajores" : "celo";
      break;
    }
    case optimism.id: {
      outputCurrency = getSmartContractAddress(optimism.id);
      swapChain = "optimism";
      break;
    }
    case optimismSepolia.id: {
      outputCurrency = getSmartContractAddress(optimismSepolia.id);
      swapChain = "optimism_sepolia";
      break;
    }
    case polygonMumbai.id: {
      outputCurrency = getSmartContractAddress(polygonMumbai.id);
      swapChain = dex === "Uniswap" ? "polygon_mumbai" : "polygon";
    }
    case polygon.id:
    default: {
      outputCurrency = getSmartContractAddress(polygon.id);
      swapChain = "polygon";
      break;
    }
  }

  let outputUrl;
  switch (dex) {
    case "Matcha":
      outputUrl = `https://matcha.xyz/tokens/${swapChain}/${outputCurrency}`;
      break;
    case "Zeroswap":
      outputUrl = `https://app.zeroswap.io/swap/${chain.id}/${inputCurrency}/${outputCurrency}`;
      break;
    case "Uniswap":
    default:
      // exception for celo, we'll use cUSD instead of USDC as input
      if (chain.id === celo.id) {
        const cUSDContractAddress =
          "0x765de816845861e75a25fca122bb6898b8b1282a";
        outputUrl = `https://app.uniswap.org/#/swap?inputCurrency=${cUSDContractAddress}&outputCurrency=${outputCurrency}&exactAmount=${amount}&exactField=input&chain=${swapChain}`;
        break;
      }
      outputUrl = `https://app.uniswap.org/#/swap?inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&exactAmount=${amount}&exactField=input&chain=${swapChain}`;
  }

  return outputUrl;
};

export const getBalance = async (
  address: string,
  chainId?: number
): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(
    getChainRPCUrl(chainId)
  );
  const abi = ["function balanceOf(address account) view returns (uint256)"];
  const usdgloContract = new ethers.Contract(
    getSmartContractAddress(chainId),
    abi,
    provider
  );
  return await usdgloContract.balanceOf(address);
};

export const numberToHex = (num: number): string => {
  return "0x" + num.toString(16);
};

export const hexToNumber = (hex: string): number => {
  return parseInt(hex, 16);
};

export const getTotalGloBalance = (
  balances: (FetchBalanceResult | undefined)[]
): FetchBalanceResult => {
  let totalBalanceValue = 0;
  for (const balance of balances) {
    if (balance) {
      totalBalanceValue += Number(balance!.formatted);
    }
  }

  return {
    decimals: 18,
    formatted: totalBalanceValue.toString(),
    symbol: "USDGLO",
    value: BigInt(totalBalanceValue * 10 ** 18) / BigInt(10 ** 18),
  };
};

export const customFormatBalance = (
  balance: FetchBalanceResult | undefined
): {
  yearlyYield: number;
  yearlyYieldFormatted: string;
  yearlyYieldUSFormatted: string;
  dblFmtBalance: string;
  fmtBalanceDollarPart: string;
  fmtBalanceCentPart: string;
} => {
  const yearlyYield = getTotalYield(Number(balance ? balance.formatted : 0));
  const yearlyYieldFormatted =
    yearlyYield > 0 ? `~$${yearlyYield.toFixed(2)}` : "$0";
  const yearlyYieldUSFormatted =
    yearlyYield > 0 ? `~$${getUSFormattedNumber(yearlyYield)}` : "$0";

  const dblFmtBalance = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(Number(balance ? balance.formatted : 0))
    .replaceAll(",", "");

  const splitFmtBalance = dblFmtBalance.split(".");
  const fmtBalanceDollarPart = splitFmtBalance[0];
  let fmtBalanceCentPart = splitFmtBalance[1];
  if (fmtBalanceCentPart === undefined) {
    fmtBalanceCentPart = "00";
  } else if (fmtBalanceCentPart?.length === 1) {
    fmtBalanceCentPart += "0";
  }

  return {
    yearlyYield,
    yearlyYieldFormatted,
    yearlyYieldUSFormatted,
    dblFmtBalance,
    fmtBalanceDollarPart,
    fmtBalanceCentPart,
  };
};
