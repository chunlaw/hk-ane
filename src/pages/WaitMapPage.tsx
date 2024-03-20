import { useCallback, useContext, useEffect, useRef } from "react";
import Leaflet from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { Box, SxProps, Theme, Typography } from "@mui/material";
import AppContext from "../AppContext";
import { Outlet, useNavigate } from "react-router-dom";
import { AVAILABLE_HOSPITALS, HOSPITAL_GEOCOOR, Hospital } from "ane-hk";
import { useTranslation } from "react-i18next";

export default function MapPage() {
  const {
    map: { center, zoom },
    flyTo,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const mapRef = useRef<any>(null);

  const handleClick = useCallback(
    (hospital: Hospital) => () => {
      console.log(hospital);
      // navigate(`/map/${encodeURI(hospital)}`);
      flyTo(hospital, mapRef.current?.getZoom() ?? 15);
    },
    [navigate],
  );

  const handleResize = useCallback(() => {
    mapRef.current?.invalidateSize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { t } = useTranslation();

  return (
    <Box sx={rootSx}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          crossOrigin="anonymous"
          detectRetina
          maxZoom={Leaflet.Browser.retina ? 20 : 19}
          maxNativeZoom={18}
          keepBuffer={10}
          updateWhenIdle={true}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomright" />
        {AVAILABLE_HOSPITALS.en.map((hospital) => (
          <Marker
            position={{
              lat: HOSPITAL_GEOCOOR[hospital as Hospital].lat,
              lng: HOSPITAL_GEOCOOR[hospital as Hospital].long,
            }}
            key={hospital}
            eventHandlers={{
              mouseover: (event) => event.target.openPopup(),
              click: handleClick(hospital as Hospital),
            }}
          >
            <Tooltip direction="bottom" offset={[-15, 30]} permanent>
              <Typography variant="caption">{t(hospital)}</Typography>
            </Tooltip>
          </Marker>
        ))}
        <ChangeView />
      </MapContainer>
      <Outlet />
    </Box>
  );
}

const ChangeView = () => {
  const {
    map: { center, zoom },
  } = useContext(AppContext);
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const rootSx: SxProps<Theme> = {
  overflow: "clip",
  flex: 1,
};
