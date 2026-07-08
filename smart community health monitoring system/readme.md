# Smart Community Health Monitoring System 💙

**A Smart India Hackathon (SIH) Project**

## 🚀 Overview
The **Smart Community Health Monitoring System** is a comprehensive digital health platform designed to bridge the gap between rural/urban communities and healthcare providers. It enables real-time monitoring of vital signs, AI-driven risk prediction, and automated emergency alerts to ensure timely medical intervention.

## ⚠️ Problem Statement
In many communities, healthcare is reactive rather than proactive. Fragmented health records, lack of continuous monitoring for chronic patients, and delayed emergency responses contribute to poor health outcomes. Our system addresses these by digitizing records and providing real-time insights to healthcare workers.

## ✨ Key Features
- **Real-time Vitals Monitoring:** Track heart rate, SpO2, temperature, and blood pressure.
- **AI-Powered Risk Prediction:** Machine learning models to identify high-risk cases early.
- **Automated Emergency Alerts:** Instant notifications to doctors and families via SMS/Email.
- **Digital Health Records:** Centralized and secure storage for patient history and prescriptions.
- **Community Dashboard:** Visual analytics for healthcare administrators to monitor community-wide health trends.
- **Role-Based Access:** Dedicated portals for Patients, Doctors, and Admin.

## 🛠️ Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (Dashboard) / React (App)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI/ML:** Python (Scikit-learn / TensorFlow)
- **DevOps:** GitHub Actions, Firebase Auth

## 📂 Project Structure
- `index.html`: Main Dashboard UI.
- `server/`: Node.js/Express backend API.
- `ai/`: Python scripts for risk prediction.
- `SYSTEM_DESIGN.md`: Architecture and Database Schema details.
- `SIH_PPT_STRUCTURE.md`: Outlined slides for presentation.
- `DEMO_SCRIPT.md`: Step-by-step script for the final demo.

## 🚦 Getting Started

### Prerequisites
- Node.js (v14+)
- Python 3.x
- MongoDB (Local or Atlas)

### Running the Dashboard (Frontend)
1. Open a terminal in the root folder.
2. Run a local server:
   ```bash
   python -m http.server 8000
   ```
3. Visit `http://localhost:8000`

### Running the Backend (API)
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Set up `.env` (copy from `.env.example`)
4. Start the server: `npm start`

## 📊 Documentation
- [System Design & Architecture](./SYSTEM_DESIGN.md)
- [PPT Structure](./SIH_PPT_STRUCTURE.md)
- [Demo Script](./DEMO_SCRIPT.md)

---
Developed with ❤️ for Smart India Hackathon.
