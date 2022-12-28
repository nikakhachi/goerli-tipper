import { createContext, useState, PropsWithChildren } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_INTERFACE } from "../constants";
import { Memo } from "../types";

type TipContextType = {
  isMining: boolean;
  fetchAndUpdateMemos: (signer: ethers.providers.JsonRpcSigner) => Promise<void>;
  memos: Memo[];
  handleMemo: (signer: ethers.providers.JsonRpcSigner, message: string) => Promise<void>;
  setMemos: (memos: Memo[]) => void;
  setNewMemoEventHandler: (signer: ethers.providers.JsonRpcSigner) => void;
  areMemosLoading: boolean;
  contractAddress?: string;
};

export const TipContext = createContext<TipContextType | null>(null);

export const TipsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isMining, setIsMining] = useState(false);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [areMemosLoading, setAreMemosLoading] = useState(true);
  const [tipContract, setTipContract] = useState<ethers.Contract>();

  const getMemoContract = (signer: ethers.Signer | ethers.providers.Provider | undefined): ethers.Contract => {
    if (tipContract) return tipContract;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_INTERFACE, signer);
    setTipContract(contract);
    return contract;
  };

  const fetchAndUpdateMemos = async (signer: ethers.providers.JsonRpcSigner) => {
    setAreMemosLoading(true);
    const memoContract = getMemoContract(signer);
    const memosRaw = await memoContract.getMemos();
    console.log(memosRaw);
    setMemos(
      memosRaw
        .map((item: any) => ({
          from: item.from,
          message: item.message,
          timestamp: item.timestamp.toNumber(),
          ethAmount: Number(ethers.utils.formatEther(item.amount)),
        }))
        .sort((a: Memo, b: Memo) => b.timestamp - a.timestamp)
    );
    setAreMemosLoading(false);
  };

  const handleMemo = async (signer: ethers.providers.JsonRpcSigner, message: string) => {
    try {
      const memoContract = getMemoContract(signer);
      const memoTxn = await memoContract.giveTip(message, { gasLimit: 300000, value: ethers.utils.parseEther("0.001") });
      setIsMining(true);
      await memoTxn.wait();
      setIsMining(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setNewMemoEventHandler = (signer: ethers.providers.JsonRpcSigner) => {
    const memoContract = getMemoContract(signer);
    memoContract.provider.once("block", () => {
      memoContract.on("NewMemo", (from: string, timestamp: number, message: string, amount: any) => {
        console.log("NewMemo", from, timestamp, message);
        setMemos((prevState) => [
          {
            from,
            timestamp: timestamp,
            message,
            ethAmount: Number(ethers.utils.formatEther(amount)),
          },
          ...prevState,
        ]);
      });
    });
  };

  const value = {
    isMining,
    fetchAndUpdateMemos: (signer: ethers.providers.JsonRpcSigner) => fetchAndUpdateMemos(signer),
    memos,
    handleMemo,
    setMemos,
    setNewMemoEventHandler: (signer: ethers.providers.JsonRpcSigner) => setNewMemoEventHandler(signer),
    areMemosLoading,
    contractAddress: tipContract?.address,
  };

  return <TipContext.Provider value={value}>{children}</TipContext.Provider>;
};
