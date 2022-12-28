import React, { useContext, useState } from "react";
import { Button, TextField, Typography, Grid, CircularProgress } from "@mui/material";
import { TipContext } from "../contexts/TipContractContext";
import { WalletContext } from "../contexts/WalletContext";

const DEFAULT_TIP = 0.001;
const MINIMUM_TIP = 0.00001;

export const InputForm = () => {
  const tipContext = useContext(TipContext);
  const walletContext = useContext(WalletContext);
  const [message, setMessage] = useState("");
  const [tip, setTip] = useState(DEFAULT_TIP);

  const handleMemo = async () => {
    if (tip < MINIMUM_TIP) return alert(`Minimum Tip Amount is ${MINIMUM_TIP}`);
    if (walletContext) {
      await tipContext?.handleMemo(walletContext.getSigner(), message, tip);
      setMessage("");
      setTip(DEFAULT_TIP);
    }
  };

  return (
    <>
      <Typography textAlign="center" variant="h2" gutterBottom>
        Goerli Tipper
      </Typography>
      <Grid item container xs={12} sm={8} md={3} sx={{ display: "flex", gap: "1rem" }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value.substring(0, 50))}
            label="Message"
            variant="outlined"
            disabled={tipContext?.isMining}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            value={tip}
            onChange={(e) => setTip(Number(e.target.value))}
            label="Tip Amount (ETH)"
            variant="outlined"
            disabled={tipContext?.isMining}
            type="number"
          />
        </Grid>
        <Grid xs={12}>
          <Button fullWidth disabled={tipContext?.isMining} variant="contained" onClick={handleMemo}>
            {tipContext?.isMining ? (
              <>
                <CircularProgress sx={{ marginRight: "5px" }} color="info" size="1rem" /> Mining ⛏️
              </>
            ) : (
              "TIP 🪙🪙"
            )}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
