import { Box, Table, Typography, TableHead, TableCell, TableBody, TableRow } from "@mui/material"
import { AVAILABLE_HOSPITALS, DayTimePoint, Hospital } from "ane-hk"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next";
import AppContext from "../AppContext";
import { useNavigate } from "react-router-dom";

type WaitListPageState = Record<string, Partial<Record<DayTimePoint, string>>>

const WaitListPage = () => {
  const [state, setState] = useState<WaitListPageState>({})
  const { aneHk } = useContext(AppContext)
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const crawl = useCallback(() => {
    const curDate = new Date();
    Promise.all(
      AVAILABLE_HOSPITALS.en
        .map(hosp => (
          aneHk.getWaitingTime(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate(), hosp as Hospital)
            .then(r => [hosp, r] as [string, Partial<Record<DayTimePoint, string>>])
            .catch(() => [hosp, {}] as [string, Partial<Record<DayTimePoint, string>>])
        ))
    ).then(res => (
      setState(
        res.reduce((acc, [hosp, ret]) => {
          acc[hosp as string] = ret
          return acc
        }, {} as Record<string, Partial<Record<DayTimePoint, string>>>)
      )
    ))
  }, [])

  useEffect(() => {
    const timer = setInterval(crawl, 60000)
    crawl()
    return () => {
      clearInterval(timer)
    }
  }, [crawl])

  const handleClick = useCallback((hospital: Hospital) => () => {
    console.log(hospital)
    navigate(`/${i18n.language}/${hospital}`)
  }, [i18n.language, navigate])

  const lastUpdateTime = useMemo<string>(() => {
    const entries = Object.entries(state)
    if ( entries.length ) {
      return Object.keys(entries[0][1]).slice(-1)[0]
    }
    return ""
  }, [state])

  return (
    <Box flex={1} width="100%" display="flex" flexDirection="column" alignItems="flex-end">
      <Typography variant="caption">{t("Last updated time: ")} {lastUpdateTime}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("Hospital")}</TableCell>
            <TableCell>{t("Waiting time reference")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(state).map(([hospName, topWait]) => (
            <TableRow key={hospName}>
              <TableCell onClick={handleClick(hospName as Hospital)}>{t(hospName)}</TableCell>
              <TableCell>{t(Object.values(topWait).slice(-1)[0])}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export default WaitListPage