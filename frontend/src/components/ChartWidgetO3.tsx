import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchO3TileUrl } from "../utils/apiHandler";
import useAppStore from "../utils/store";
import toast from "react-hot-toast";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

const ChartWidgetO3 = () => {
  const { feature, Map, setReload } = useAppStore((state) => ({
    feature: state.feature,
    Map: state.Map,
    setReload: state.setReload,
  }));

  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [isChecked, setCheck] = useState(true);

  // Calculate the year range based on selected start and end years.
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
      fetchO3TileUrl(yearRange, feature),
    mutationKey: ["O3_TILE"],
    onSuccess(data) {
      const o3Tile = new TileLayer({
        source: new XYZ({
          url: data.data.url,
        }),
        className: "o3",
      });
      Map?.addLayer(o3Tile);
      setReload();
      toast.success("O₃ tile loaded");
    },
    onError() {
      toast.error("Error loading O₃ tile");
    },
  });

  const handleSubmit = () => {
    if (feature !== null) {
      if (yearRange.length === 0) {
        toast.error("Please select a valid year range");
        return;
      }
      toast.promise(tileMutation.mutateAsync({ feature, yearRange }), {
        loading: "Loading O₃ tile...",
        success: "O₃ tile loaded",
        error: "Error loading O₃ tile",
      });
    } else {
      toast.error("Geometry data is missing");
    }
  };

  // Generate a list of years for the dropdown (e.g., current year - 2 down to 20 years before)
  const years = useMemo(() => {
    const max = new Date().getFullYear() - 2;
    const min = max - 20;
    return Array.from({ length: max - min + 1 }, (_, i) => max - i);
  }, []);

  return (
    <div className="w-full">
      <div className="flex gap-1">
        <select
          value={startYear}
          className="select select-bordered select-sm w-full max-w-xs"
          onChange={(e) => setStartYear(e.target.value)}
        >
          <option disabled selected>
            Start Year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              onChange={() => setCheck(!isChecked)}
              checked={isChecked}
              className="checkbox checkbox-primary"
            />
          </label>
        </div>
        <select
          value={endYear}
          className="select select-bordered select-sm w-full max-w-xs"
          disabled={isChecked}
          onChange={(e) => setEndYear(e.target.value)}
        >
          <option disabled selected>
            End Year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <button
        className={`btn btn-primary btn-block ${tileMutation.isPending ? "btn-disabled" : ""}`}
        onClick={handleSubmit}
      >
        {tileMutation.isPending ? (
          <span className="loading loading-spinner loading-sm text-gray-700">Loading...</span>
        ) : (
          <>Submit</>
        )}
      </button>
      {tileMutation.isSuccess && <p>O₃ overlay has been added to the map.</p>}
    </div>
  );
};

export default ChartWidgetO3;
