import React, { useContext, useState } from "react";
import { Button, TextField, Typography, Grid, CircularProgress } from "@mui/material";
import { TipContext } from "../contexts/TipContractContext";
import { WalletContext } from "../contexts/WalletContext";

export const InputForm = () => {
  const tipContext = useContext(TipContext);
  const walletContext = useContext(WalletContext);
  const [message, setMessage] = useState("");

  const handleMemo = async () => {
    if (walletContext) {
      await tipContext?.handleMemo(walletContext.getSigner(), message);
      setMessage("");
    }
  };

  return (
    <>
      <Typography textAlign="center" variant="h2" gutterBottom>
        Goerli Testnet Network
      </Typography>
      <Grid item xs={12} sm={8} md={6} sx={{ display: "flex", gap: "1rem" }}>
        <TextField
          fullWidth
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value.substring(0, 50))}
          label="Message"
          variant="outlined"
          disabled={tipContext?.isMining}
        />
        <Button disabled={tipContext?.isMining} sx={{ width: "50%" }} variant="contained" onClick={handleMemo}>
          {tipContext?.isMining ? (
            <>
              <CircularProgress sx={{ marginRight: "5px" }} color="info" size="1rem" /> Mining ⛏️
            </>
          ) : (
            "TIP 🪙🪙"
          )}
        </Button>
      </Grid>
    </>
  );
};
