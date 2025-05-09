```markdown
# GeoBharat – GIS-Based Application

## Problem Statement
A GIS-based web dashboard is required to visualize and analyze demographic, socio-economic, and environmental data across India. The platform should:
- Aggregate data from multiple publicly available sources.
- Provide an interactive map with customizable data layers (pollution, temperature, demographics, etc.).
- Allow users to analyze trends over time.
- Enable exporting and sharing of map views for reporting and collaboration.

## Solution Overview
GeoBharat is a full-stack GIS dashboard built using React.js + OpenLayers for the frontend and Python (FastAPI + Google Earth Engine) for the backend.

Users can draw custom polygons on the map to visualize and analyze various environmental and socio-economic parameters across India.

## Key Features
- Interactive Map with polygon drawing and selection
- Dynamic Data Layers including:
  1. Forest Ecology
  2. Air Pollution
  3. Rainfall
  4. AQI (Air Quality Index)
  5. NO₂ (Nitrogen Dioxide)
  6. O₃ (Ozone)
- Historical Analysis: Choose specific years to compare trends over time
- Graphical Insights: Real-time visual analytics from selected data
- Export & Share: Map views exportable as images for reports and presentations

## Tech Stack

### Frontend:
- React.js (with Vite)
- OpenLayers (for interactive maps)
- Zustand (state management)
- Chart.js (visualizations)
- Axios (API calls)

### Backend:
- Python 3
- FastAPI (for REST APIs)
- Google Earth Engine (for satellite/environmental data)
- Uvicorn (ASGI server)

## Installation & Setup

### Prerequisites:
- Node.js (for frontend)
- Python 3.8+ (for backend)
- Git

### 1. Clone the Repository
git clone https://github.com/your-org/geobharat.git
cd geobharat
```



#### 2. Frontend Setup
```sh
 cd frontend
 npm install
 npm start
```
#### 3. Backend Setup
```sh
cd ../backend
python -m venv venv

# Activate the virtual environment:
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload

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


