import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchAqiTileUrl } from "../utils/apiHandler";
import toast from "react-hot-toast";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import useAppStore from "../utils/store";

const ChartWidgetAqi = () => {
  const { feature, Map, setReload } = useAppStore((state) => ({
    feature: state.feature,
    Map: state.Map,
    setReload: state.setReload,
  }));
//   const { aqi } = useShareStore((state) => state.mergedValue);

  const [startYear, setStartYear] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [isChecked, setCheck] = useState(true);

  const yearRange = useMemo(() => {
    const parsedStartYear = parseInt(startYear);
    const parsedEndYear = parseInt(endYear);

    if (!isNaN(parsedStartYear) && !isNaN(parsedEndYear)) {
      return Array.from({ length: parsedEndYear - parsedStartYear + 1 }, (_, i) => parsedEndYear - i);
    } else if (!isNaN(parsedStartYear)) {
      return [parsedStartYear];
    } else if (!isNaN(parsedEndYear)) {
      return [parsedEndYear];
    } else {
      return [];
    }
  }, [startYear, endYear]);

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
      toast.success("AQI tile loaded");
    },
    onError() {
      toast.error("Error loading AQI tile");
    },
  });

  const handleSubmit = () => {
    if (feature !== null) {
      toast.promise(tileMutation.mutateAsync({ feature, yearRange }), {
        loading: "Loading AQI tile...",
        success: "AQI tile loaded",
        error: "Error loading AQI tile",
      });
    } else {
      toast.error("Geometry data is missing");
    }
  };

  const years = useMemo(() => {
    const max = new Date().getFullYear() - 2;
    const min = max - 20;
    return Array.from({ length: max - min + 1 }, (_, i) => max - i);
  }, []);

  return (
    <div className="w-full">
      <div className="flex gap-1">
        <select value={startYear} className="select select-bordered select-sm w-full max-w-xs" onChange={(e) => setStartYear(e.target.value)}>
          <option disabled selected>Start Year</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <div className="form-control">
          <label className="label cursor-pointer">
            <input type="checkbox" onChange={() => setCheck(!isChecked)} checked={isChecked} className="checkbox checkbox-primary" />
          </label>
        </div>
        <select className="select select-bordered select-sm w-full max-w-xs" disabled={isChecked} onChange={(e) => setEndYear(e.target.value)}>
          <option disabled selected>End Year</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <button className={`btn btn-primary btn-block ${tileMutation.isPending ? "btn-disabled" : ""}`} onClick={handleSubmit}>
        {tileMutation.isPending ? <span className="loading loading-spinner loading-sm text-gray-700">Loading...</span> : <>Submit</>}
      </button>

      {tileMutation.isSuccess && <p>AQI overlay has been added to the map.</p>}
    </div>
  );
};

export default ChartWidgetAqi;
