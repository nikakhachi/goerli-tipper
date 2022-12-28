import React, { useContext, useState } from "react";
import { Button, TextField, Typography, Grid, CircularProgress, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { TipContext } from "../contexts/TipContractContext";
import { WalletContext } from "../contexts/WalletContext";

export const InputForm = () => {
  const tipContext = useContext(TipContext);
  const walletContext = useContext(WalletContext);
  const [message, setMessage] = useState("");
  const [alignment, setAlignment] = React.useState<string | null>("0.001");

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    if (!newAlignment) return null;
    setAlignment(newAlignment);
  };

  const handleMemo = async () => {
    if (walletContext) {
      await tipContext?.handleMemo(walletContext.getSigner(), message, Number(alignment));
      setMessage("");
    }
  };

  return (
    <>
      <Typography textAlign="center" variant="h2" gutterBottom>
        Buy Me a Coffee ☕
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
          <ToggleButtonGroup
            disabled={tipContext?.isMining}
            fullWidth
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton sx={{ textTransform: "none" }} value="0.001" aria-label="left aligned">
              <Typography>
                ☕ <span style={{ fontSize: "0.7rem", fontStyle: "italic" }}>(0.001 ETH)</span>
              </Typography>
            </ToggleButton>
            <ToggleButton sx={{ textTransform: "none" }} value="0.002" aria-label="centered">
              <Typography>
                2x ☕ <span style={{ fontSize: "0.7rem", fontStyle: "italic" }}>(0.002 ETH)</span>
              </Typography>
            </ToggleButton>
            <ToggleButton sx={{ textTransform: "none" }} value="0.004" aria-label="justified" size="small">
              <Typography>
                4x ☕ <span style={{ fontSize: "0.7rem", fontStyle: "italic" }}>(0.004 ETH)</span>
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid xs={12}>
          <Button fullWidth disabled={tipContext?.isMining} variant="contained" onClick={handleMemo}>
            {tipContext?.isMining ? (
              <>
                <CircularProgress sx={{ marginRight: "5px" }} color="info" size="1rem" /> Mining ⛏️
              </>
            ) : (
              "Buy Coffee"
            )}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
