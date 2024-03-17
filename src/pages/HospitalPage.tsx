import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AppContext from "../AppContext"
import { Hospital } from "ane-hk"
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

const HospitalPage = () => {
  const { hospital } = useParams()
  const { aneHk }  = useContext(AppContext)
  const [state, setState] = useState<Array<[string, string]>>([])
  const { t } = useTranslation()

  useEffect(() => {
    console.log(hospital)
    aneHk.getLast24Hours(hospital as Hospital)
      .then(r => setState(r.reverse()))
  }, [aneHk, hospital])
  
  
  return (
    <Box flex={1} overflow="scroll">
      <Typography variant="h6">{t(hospital ?? "")}</Typography>
      <Typography variant="body1">{t("Top wait hours for past 24 hours")}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("Time")}</TableCell>
            <TableCell>{t("Waiting time reference")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.map(([time, waitTime], idx) => (
            <TableRow key={`row-${idx}`}>
              <TableCell>{time}</TableCell>
              <TableCell>{t(waitTime)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export default HospitalPage