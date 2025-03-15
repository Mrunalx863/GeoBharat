```markdown
# GeoBharat - GIS-Based Appllication

## Problem Statement
A GIS-based web dashboard is required to visualize and analyze demographic, socio-economic, and environmental data across India. The platform should:
- Aggregate data from multiple publicly available sources.
- Provide an interactive map with customizable data layers (pollution, temperature, demographics, etc.).
- Allow users to analyze trends over time.
- Enable exporting and sharing of map views in image format for reporting and collaboration.

## Solution Overview
We developed a solution using **React** and **OpenLayers** for the frontend, and **Node.js (Express.js), FastAPI, and Google Earth Engine** for the backend. The platform allows users to draw custom polygons on the map to visualize and analyze various environmental and socio-economic factors.

## Key Features
- **Interactive Map**: Users can draw polygons to analyze selected parameters.
- **Data Layers**: The dashboard supports six key environmental parameters:
  1. Forest Ecology
  2. Air Pollution
  3. Rainfall
  4. AQI (Air Quality Index)
  5. NO₂ (Nitrogen Dioxide)
  6. O₃ (Ozone)
- **Yearly Analysis**: Users can select specific years for historical data visualization.
- **Graphical Representation**: The system generates visual analytics based on selected parameters.
- **Export & Share**: Users can export map views in image format for reporting and collaboration.

## Tech Stack
### Frontend:
- **React.js**
- **OpenLayers** (for interactive mapping)

### Backend:
- **Node.js (Express.js)** (for handling API requests)
- **FastAPI** (for geospatial data processing)
- **Python**
- **Google Earth Engine** (for geospatial data analysis)

## Installation & Setup
### Prerequisites:
- Node.js (for frontend)
- Python 3+ (for backend)

### Steps:
#### 1. Clone the Repository
```
```sh
 git clone <repo-url>
 cd WCEHackathon2025_MetaMinds_4
```
#### 2. Frontend Setup
```sh
 cd frontend
 npm install
 npm start
```
#### 3. Backend Setup
```sh
 cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## Usage
1. Open the frontend in your browser.
2. Select a parameter (e.g., AQI, Rainfall, etc.).
3. Draw a polygon on the map to analyze the selected parameter.
4. Choose a specific year for data analysis.
5. View graphical representations of the selected data.
6. Export map views as images.

## API Endpoints
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| GET    | `/api/data`      | Fetch available data layers |
| POST   | `/api/analyze`   | Analyze data for a selected polygon |
| GET    | `/api/export`    | Export selected map view as an image |


## Demo & Screenshots
![Screenshot 2025-03-15 091651](https://github.com/user-attachments/assets/40842874-b395-4ffc-b048-fc02803e6481)
![Screenshot 2025-03-15 094527](https://github.com/user-attachments/assets/bacf31c7-5a02-45eb-9464-d1f1273ca8fc)
![Screenshot 2025-03-15 091718](https://github.com/user-attachments/assets/bd379b6a-d532-4045-a6eb-7215647bb462)



## Team MetaMinds
This project was developed as part of the **WCE Hackathon 2025** by Team **MetaMinds**.

---
Feel free to contribute, raise issues, or suggest improvements!
```


