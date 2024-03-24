import { useContext } from "react";
import { useMapEvents } from "react-leaflet";
import AppContext from "../../AppContext";

const MapHandler = () => {
  const { updateMapProp } = useContext(AppContext);

  useMapEvents({
    dragend: (event) => {
      updateMapProp(event.target.getCenter(), event.target.getZoom());
    },
    zoomend: (event) => {
      updateMapProp(event.target.getCenter(), event.target.getZoom());
    },
  });

  return null;
};

export default MapHandler;
