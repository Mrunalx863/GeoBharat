from itertools import cycle
import ee
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic_models import *
from utils import *

router = APIRouter(prefix="/api")

# ---------------------- Existing Endpoints ----------------------

@router.post("/get_montly_ndvi/", tags=["monthly"])
def get_ndvi_data(data: RequestedData):
    try:
        lst: list[GraphModel] = []
        for year in data.years:
            roi = ee.Geometry.Polygon([data.polygon])
            months_lst = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ]
            months = enumerate(months_lst, start=1)
            months_cycle = cycle(months)
            ndvi_values = [
                get_monthly_ndvi(next(months_cycle), year=year, roi=roi)
                for _ in range(len(months_lst))
            ]
            g = GraphModel(year=year, columns=months_lst, values=[ndvi_values])
            lst.append(g)
        r = Response(data=lst, successMesssage="success")
        return JSONResponse(content=r.model_dump(), status_code=200)
    except Exception as err:
        e = Response(errorMessage=str(err))
        return JSONResponse(content=e.model_dump(), status_code=400)


@router.post("/get_monthly_co/", tags=["monthly"])
def get_co(data: RequestedData):
    try:
        lst: list[GraphModel] = []
        for year in data.years:
            roi = ee.Geometry.Polygon([data.polygon])
            months_lst = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ]
            months = enumerate(months_lst, start=1)
            months_cycle = cycle(months)
            co_values = [
                get_monthly_co(next(months_cycle), year=year, roi=roi)
                for _ in range(len(months_lst))
            ]
            g = GraphModel(year=year, columns=months_lst, values=co_values)
            lst.append(g)
        r = Response(data=lst, successMesssage="success")
        return JSONResponse(content=r.model_dump(), status_code=200)
    except Exception as err:
        e = Response(errorMessage=str(err))
        return JSONResponse(content=e.model_dump(), status_code=400)


@router.post("/get_annual_rainfall", tags=["annual"])
def get_annual_rainfall(data: RequestedData):
    column_lst = []
    value_lst = []
    roi = ee.Geometry.Polygon([data.polygon])
    for year in data.years:
        column_lst.append(str(year))
        precipitation = yearly_rainfall(year, roi)
        value_lst.append(precipitation)
    g = GraphModel(columns=column_lst, values=value_lst)
    r = Response(data=g, successMesssage="Success")
    return JSONResponse(content=r.model_dump(), status_code=200)


@router.post("/get_co_tile", tags=["tile"])
def get_co_tile(data: RequestedData):
    roi = ee.Geometry.Polygon([data.polygon])
    years = data.years
    if not years:
        raise ValueError("Years list cannot be empty.")
    end_year = years[0]
    start_year = years[-1]
    collection = (
        ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_CO")
        .select("CO_column_number_density")
        .filterDate(f"{start_year}-01-01", f"{end_year}-12-31")
    )
    band_viz = {
        "min": 0,
        "max": 0.05,
        "palette": ["black", "blue", "purple", "cyan", "green", "yellow", "red"],
    }
    co = collection.mean().clip(roi)
    id = co.getMapId(band_viz)
    tile_url = id["tile_fetcher"].url_format
    r = Response(data={"url": tile_url}, successMesssage="Success")
    return JSONResponse(content=r.model_dump(), status_code=200)


@router.post("/get_ndvi_tile", tags=["tile"])
def get_ndvi_tile(data: RequestedData):
    roi = ee.Geometry.Polygon([data.polygon])
    years = data.years
    if not years:
        raise ValueError("Years list cannot be empty.")
    end_year = years[0]
    start_year = years[-1]
    image = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterDate(f"{start_year}-01-01", f"{end_year}-12-31")
        .filterBounds(roi)
        .map(calc_ndvi)
    )
    ndvi_params = {
        "min": -1.0,
        "max": 1.0,
        "palette": [
            "800000", "A52A2A", "F5F5DC", "FFFF00",
            "7FFF00", "008000", "006400"
        ],
    }
    id = image.select("NDVI").mean().clip(roi).getMapId(ndvi_params)
    tile_url = id["tile_fetcher"].url_format
    r = Response(data={"url": tile_url}, successMesssage="Success")
    return JSONResponse(content=r.model_dump(), status_code=200)


@router.post("/get_precipitation_tile", tags=["tile"])
def get_precipitation_tile(data: RequestedData):
    roi = ee.Geometry.Polygon([data.polygon])
    precipitationVis = {
        "min": 0,
        "max": 2000,
        "palette": ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
    }
    years = data.years
    if not years:
        raise ValueError("Years list cannot be empty.")
    end_year = years[0]
    start_year = years[-1]
    collection = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD").filterDate(
        f"{start_year}-01-01", f"{end_year}-12-31"
    )
    prec = collection.mean().clip(roi)
    id = prec.getMapId(precipitationVis)
    tile_url = id["tile_fetcher"].url_format
    r = Response(data={"url": tile_url}, successMesssage="Success")
    return JSONResponse(content=r.model_dump(), status_code=200)


# ---------------------- New Endpoints ----------------------

@router.post("/get_no2_tile", tags=["tile"])
def get_no2_tile(data: RequestedData):
    """
    Retrieves a tile URL for nitrogen dioxide (NO₂) data from Sentinel-5P.
    """
    try:
        roi = ee.Geometry.Polygon([data.polygon])
        years = data.years
        if not years:
            raise ValueError("Years list cannot be empty.")
        end_year = years[0]
        start_year = years[-1]
        collection = (
            ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_NO2")
            .select("NO2_column_number_density")
            .filterDate(f"{start_year}-01-01", f"{end_year}-12-31")
        )
        no2_params = {
            "min": 0,
            "max": 0.0002,
            "palette": ["black", "blue", "purple", "cyan", "green", "yellow", "red"],
        }
        no2_image = collection.mean().clip(roi)
        id = no2_image.getMapId(no2_params)
        tile_url = id["tile_fetcher"].url_format
        r = Response(data={"url": tile_url}, successMesssage="Success")
        return JSONResponse(content=r.model_dump(), status_code=200)
    except Exception as err:
        e = Response(errorMessage=str(err))
        return JSONResponse(content=e.model_dump(), status_code=400)


@router.post("/get_o3_tile", tags=["tile"])
def get_o3_tile(data: RequestedData):
    """
    Retrieves a tile URL for ozone (O₃) data from Sentinel-5P.
    """
    try:
        roi = ee.Geometry.Polygon([data.polygon])
        years = data.years
        if not years:
            raise ValueError("Years list cannot be empty.")
        end_year = years[0]
        start_year = years[-1]
        collection = (
            ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_O3")
            .select("O3_column_number_density")
            .filterDate(f"{start_year}-01-01", f"{end_year}-12-31")
        )
        o3_params = {
            "min": 0,
            "max": 0.0003,
            "palette": ["black", "blue", "purple", "cyan", "green", "yellow", "red"],
        }
        o3_image = collection.mean().clip(roi)
        id = o3_image.getMapId(o3_params)
        tile_url = id["tile_fetcher"].url_format
        r = Response(data={"url": tile_url}, successMesssage="Success")
        return JSONResponse(content=r.model_dump(), status_code=200)
    except Exception as err:
        e = Response(errorMessage=str(err))
        return JSONResponse(content=e.model_dump(), status_code=400)


@router.post("/get_region_summary", tags=["summary"])
def get_region_summary(data: RequestedData):
    """
    Provides an aggregated summary for the region including:
    - NDVI (vegetation index)
    - CO (carbon monoxide)
    - NO₂ (nitrogen dioxide)
    - Rainfall
    """
    try:
        roi = ee.Geometry.Polygon([data.polygon])
        years = data.years
        if not years:
            raise ValueError("Years list cannot be empty.")
        end_year = years[0]
        start_year = years[-1]

        # NDVI average from Sentinel-2
        ndvi_image = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterDate(f"{start_year}-01-01", f"{end_year}-12-31")
            .filterBounds(roi)
            .map(calc_ndvi)
            .select("NDVI")
            .mean()
            .clip(roi)
        )
        ndvi_value = ndvi_image.reduceRegion(
            reducer=ee.Reducer.mean(), geometry=roi, scale=30
        ).getInfo()

        # CO average from Sentinel-5P
        co_image = (
            ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_CO")
            .select("CO_column_number_density")
            .filterDate(f"{start_year}-01-01", f"{end_year}-12-31")
            .mean()
            .clip(roi)
        )
        co_value = co_image.reduceRegion(
            reducer=ee.Reducer.mean(), geometry=roi, scale=10000
        ).getInfo()

        # NO₂ average from Sentinel-5P
        no2_image = (
            ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_NO2")
            .select("NO2_column_number_density")
            .filterDate(f"{start_year}-01-01", f"{end_year}-12-31")
            .mean()
            .clip(roi)
        )
        no2_value = no2_image.reduceRegion(
            reducer=ee.Reducer.mean(), geometry=roi, scale=10000
        ).getInfo()

        # Annual rainfall average from CHIRPS
        rainfall_image = (
            ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD")
            .filterDate(f"{start_year}-01-01", f"{end_year}-12-31")
            .mean()
            .clip(roi)
        )
        rainfall_value = rainfall_image.reduceRegion(
            reducer=ee.Reducer.mean(), geometry=roi, scale=5000
        ).getInfo()

        summary = {
            "NDVI": ndvi_value,
            "CO": co_value,
            "NO2": no2_value,
            "Rainfall": rainfall_value,
        }
        r = Response(data=summary, successMesssage="Success")
        return JSONResponse(content=r.model_dump(), status_code=200)
    except Exception as err:
        e = Response(errorMessage=str(err))
        return JSONResponse(content=e.model_dump(), status_code=400)


# ---------------------- New AQI Endpoint ----------------------

@router.post("/get_aqi_tile", tags=["tile"])
def get_aqi_tile(data: RequestedData):
    """
    Retrieves a tile URL for air quality (using Aerosol Index as a proxy) from Sentinel-5P.
    """
    try:
        roi = ee.Geometry.Polygon([data.polygon])
        years = data.years
        if not years:
            raise ValueError("Years list cannot be empty.")
        end_year = years[0]
        start_year = years[-1]

        # Use Sentinel-5P Aerosol Index as a proxy for air quality.
        # Note: The band name below ("absorbing_aerosol_index") may vary. Adjust if needed.
        collection = (
            ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_AER_AI")
            .select("absorbing_aerosol_index")
            .filterDate(f"{start_year}-01-01", f"{end_year}-12-31")
        )
        aqi_params = {
            "min": -2,
            "max": 2,
            "palette": ["green", "yellow", "orange", "red", "purple"],
        }
        aqi_image = collection.mean().clip(roi)
        id = aqi_image.getMapId(aqi_params)
        tile_url = id["tile_fetcher"].url_format
        r = Response(data={"url": tile_url}, successMesssage="Success")
        return JSONResponse(content=r.model_dump(), status_code=200)
    except Exception as err:
        e = Response(errorMessage=str(err))
        return JSONResponse(content=e.model_dump(), status_code=400)
