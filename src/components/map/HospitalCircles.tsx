import { useCallback, useContext } from "react";
import { Circle, Tooltip } from "react-leaflet";
import AppContext from "../../AppContext";
import { HOSPITAL_GEOCOOR, Hospital } from "ane-hk";
import { WaitMsg } from "ane-hk/dist/types";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const HospitalCircles = () => {
  const { topWait } = useContext(AppContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { hospital: pickedHospital } = useParams();

  const handleClick = useCallback(
    (hospital: Hospital) => () => {
      if ( window.location.pathname.endsWith("map") ) {
        navigate(`/${i18n.language}/map/${encodeURI(hospital)}`);
      } else {
        navigate(`/${i18n.language}/map`);
      }
    },
    [navigate, i18n],
  );

  return (
    <>
      {Object.entries(topWait).map(([hospital, waitTime]) => (
        <Circle
          center={{
            lat: HOSPITAL_GEOCOOR[hospital as Hospital].lat,
            lng: HOSPITAL_GEOCOOR[hospital as Hospital].long,
          }}
          key={hospital}
          eventHandlers={{
            click: handleClick(hospital as Hospital),
          }}
          radius={400}
          pathOptions={{
            color: pickedHospital === hospital ? "#000" : "rgba(0, 0, 0, 0)",
            fillColor: WaitColor[waitTime] ?? "#000",
            fillOpacity: 0.8,
          }}
        >
          <Tooltip>
            {t(hospital)}: {t(waitTime)}
          </Tooltip>
        </Circle>
      ))}
    </>
  );
};

export default HospitalCircles;

const WaitColor: Record<WaitMsg, string> = {
  "": "#000",
  "< 1": "#67b02d",
  "> 1": "#83b230",
  "> 2": "#beb337",
  "> 3": "#dbb53a",
  "> 4": "#f8b63f",
  "> 5": "#f28a3f",
  "> 6": "#ec733c",
  "> 7": "#ea603c",
  "> 8": "#ea603c",
  "> 9": "#000",
  "> 10": "#000",
  "> 11": "#000",
  "> 12": "#000",
  "> 13": "#000",
  "> 14": "#000",
};
