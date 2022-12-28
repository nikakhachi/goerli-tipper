import { Paper, Table, TableCell, TableBody, TableRow, TableHead, TableContainer } from "@mui/material";
import React from "react";
import moment from "moment";
import { Memo } from "../types";

interface IProps {
  memos: Memo[];
}

export const WaveTable: React.FC<IProps> = ({ memos }) => {
  console.log(memos);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} size="small">
        <TableHead sx={{ background: "lightgray" }}>
          <TableRow>
            <TableCell>
              <strong>Sender</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Date</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Message</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Tip</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {memos.map((memo) => (
            <TableRow key={memo.timestamp}>
              <TableCell sx={{ background: "rgba(0,0,0,0.4)", color: "white" }} component="th" scope="row">
                {memo.from}
              </TableCell>
              <TableCell sx={{ background: "rgba(0,0,0,0)", borderRight: "1px solid rgba(0,0,0,0.1)" }} align="right">
                {moment.unix(memo.timestamp).format("DD/MM/YYYY h:mma")}
              </TableCell>
              <TableCell sx={{ background: "rgba(0,0,0,0)", borderRight: "1px solid rgba(0,0,0,0.1)" }} align="right">
                {memo.message}
              </TableCell>
              <TableCell sx={{ background: "rgba(0,0,0,0)" }} align="right">
                {memo.ethAmount} ETH
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
