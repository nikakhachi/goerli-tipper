import { useContext, useEffect } from "react";
import { CircularProgress, Grid } from "@mui/material";
import { WalletContext } from "../contexts/WalletContext";
import { WaveTable } from "../components/MemoTable";
import { InputForm } from "../components/InputForm";
import { TipContext } from "../contexts/TipContractContext";
import { AboutContract } from "../components/AboutContract";

export const HomeView = () => {
  const walletContext = useContext(WalletContext);
  const tipContext = useContext(TipContext);

  useEffect(() => {
    (async () => {
      if (walletContext && tipContext) {
        tipContext?.fetchAndUpdateMemos(walletContext.getSigner());
        tipContext?.setNewMemoEventHandler(walletContext.getSigner());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
      <AboutContract />
      <InputForm />
      <Grid item xs={12} sm={10}>
        {tipContext?.areMemosLoading ? <CircularProgress size="1.5rem" /> : <WaveTable memos={tipContext?.memos || []} />}
      </Grid>
    </Grid>
  );
};
