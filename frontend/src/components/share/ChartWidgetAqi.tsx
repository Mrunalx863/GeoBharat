import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchAqiTileUrl } from "../../utils/apiHandler";
import toast from "react-hot-toast";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import useAppStore, { useShareStore } from "../../utils/store";

const ChartWidgetAqi = () => {
  const { feature, Map, setReload } = useAppStore((state) => ({
    feature: state.feature,
    Map: state.Map,
    setReload: state.setReload,
  }));
  const { aqi } = useShareStore((state) => state.mergedValue);

  // Build a year range from the aqi values if available; otherwise, use a default value.
  const yearRange = useMemo(() => {
    if (aqi && aqi.length === 2) {
      const parsedStartYear = parseInt(aqi[0]);
      const parsedEndYear = parseInt(aqi[1]);
      if (!isNaN(parsedStartYear) && !isNaN(parsedEndYear)) {
        const arr = [];
        for (let i = parsedEndYear; i >= parsedStartYear; i--) {
          arr.push(i);
        }
        return arr;
      }
    }
    // Fallback default range if aqi is not properly defined.
    return [2020];
  }, [aqi]);

  const tileMutation = useMutation({
    mutationFn: ({ feature, yearRange }: { feature: number[][]; yearRange: number[] }) =>
      fetchAqiTileUrl(yearRange, feature),
    mutationKey: ["AQI_TILE"],
    onSuccess(data) {
      const aqiTile = new TileLayer({
        source: new XYZ({
          url: data.data.url,
        }),
        className: "aqi",
        properties: {
          name: "aqi",
        },
      });
      Map?.addLayer(aqiTile);
      setReload();
    },
  });

  useEffect(() => {
    if (feature !== null) {
      toast.promise(tileMutation.mutateAsync({ feature, yearRange }), {
        loading: "Loading AQI tile...",
        success: "AQI tile loaded",
        error: "Error loading AQI tile",
      });
    } else {
      toast.error("Geometry data is missing");
    }
  }, [feature]);

  return (
    <div className="w-full">
      {/* Since we don't have monthly AQI data, we display a simple message. */}
      <p>AQI overlay has been added to the map.</p>
    </div>
  );
};

export default ChartWidgetAqi;
