import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        'Accept': 'application/json',
    }
});

export const fetchNdvi = async (years: number[], feature: Array<Array<number>> | null) => {
    console.log(feature)
    try {
        const res = await api.post("/get_montly_ndvi/", {
            "polygon": feature,
            "years": years
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const fetchCo = async (years: number[], feature: Array<Array<number>> | null) => {
    try {
        const res = await api.post("/get_monthly_co/", {
            "polygon": feature,
            "years": years
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const fetchPrecipitation = async (years: number[], feature: Array<Array<number>> | null) => {
    try {
        const res = await api.post("/get_annual_rainfall", {
            "polygon": feature,
            "years": years
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const fetchCoTileUrl = async (years: number[], feature: Array<Array<number>> | null) => {
    try {
        const res = await api.post("/get_co_tile", {
            "polygon": feature,
            "years": years
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const fetchNDVITileUrl = async (years: number[], feature: Array<Array<number>> | null) => {
    try {
        const res = await api.post("/get_ndvi_tile", {
            "polygon": feature,
            "years": years
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const fetchPrecipitationTileUrl = async (years: number[], feature: Array<Array<number>> | null) => {
    try {
        const res = await api.post("/get_precipitation_tile", {
            "polygon": feature,
            "years": years
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

// ---------------------- New Endpoints ----------------------

// NO₂ Tile URL from Sentinel-5P
export const fetchNo2TileUrl = async (years: number[], feature: Array<Array<number>> | null) => {
    try {
        const res = await api.post("/get_no2_tile", {
            "polygon": feature,
            "years": years
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

// O₃ Tile URL from Sentinel-5P
export const fetchO3TileUrl = async (years: number[], feature: Array<Array<number>> | null) => {
    try {
        const res = await api.post("/get_o3_tile", {
            "polygon": feature,
            "years": years
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

// Region Summary endpoint for aggregated parameters
export const fetchRegionSummary = async (years: number[], feature: Array<Array<number>> | null) => {
    try {
        const res = await api.post("/get_region_summary", {
            "polygon": feature,
            "years": years
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

// AQI Tile URL endpoint (using Aerosol Index as a proxy)
export const fetchAqiTileUrl = async (years: number[], feature: Array<Array<number>> | null) => {
    try {
        const res = await api.post("/get_aqi_tile", {
            "polygon": feature,
            "years": years
        });
        return res.data;
    } catch (error) {
        return error;
    }
};
