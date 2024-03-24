import { useContext } from "react";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import { Box, SxProps, Theme } from "@mui/material";
import AppContext from "../AppContext";
import { useParams } from "react-router-dom";
import MapInfo from "../components/map/HospitalMapInfo";
import HospitalCircles from "../components/map/HospitalCircles";
import MapHandler from "../components/map/MapHandler";
import HospitalMapInfo from "../components/map/HospitalMapInfo";

export default function MapPage() {
  const {
    map: { center, zoom },
  } = useContext(AppContext);
  const { hospital } = useParams();

  return (
    <Box sx={rootSx}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100%" }}
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
        <HospitalCircles />
        <ChangeView />
        <HospitalMapInfo hospital={hospital} />
        <MapHandler />
      </MapContainer>
      <MapInfo hospital={hospital} />
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
  position: "relative",
};
