# Snakeify 🐍🎧

> The classic Snake game, but you eat your Spotify Liked Songs.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Spotify](https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)](https://developer.spotify.com/)

<img width="1918" height="930" alt="image" src="https://github.com/user-attachments/assets/9899be9b-4cb0-4fc4-92dd-a9b5517a0973" />
<img width="1334" height="923" alt="image" src="https://github.com/user-attachments/assets/84ddcace-047d-4100-a56a-84feb262e2ca" />
<img width="761" height="603" alt="image" src="https://github.com/user-attachments/assets/f442cf38-7c43-4b29-84f4-816dcd76d69c" />
<img width="1919" height="927" alt="image" src="https://github.com/user-attachments/assets/566831e0-a2a5-4e8c-a533-24adc19be414" />



## 🎮 Gameplay

In Snakeify, you control a snake that feeds on album covers from your Spotify "Liked Songs" playlist. As you eat:
- 🔊 Hear 30-second previews of songs
- 🌈 Background dynamically adapts to album art colors
- 📈 Snake grows with each song consumed
- 🏆 Score saved to a global leaderboard

## ✨ Features

- **🎵 Spotify Integration**: OAuth2 authentication to access your personal music library
- **⚡ Lag-free Audio**: Pre-loading engine ensures seamless playback
- **🎨 Reactive UI**: ColorThief algorithm extracts dominant colors for immersive visuals
- **🏆 Global Leaderboard**: PostgreSQL with JSONB storage for persistent score tracking
- **📱 Mobile-First Controls**: Intuitive swipe gestures for touchscreen devices

## 🚀 Quick Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Spotify Developer Account](https://developer.spotify.com/dashboard)

### Spotify App Configuration

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in and click **"Create App"**
3. Enter an **App Name** (e.g., "Snakeify Local") and **App Description**
4. In the **Redirect URIs** field, add:
   ```
   http://localhost:8000/callback
   ```
5. Click **Save**
6. Click on **Settings** to find your **Client ID** and **Client Secret**

### Environment Variables

Create a `.env` file in the project root:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

### Running the Application (Docker)

```bash
docker-compose up --build
```

Visit:
- **Game**: [http://localhost:5173](http://localhost:5173)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Manual Setup (Without Docker)

If you prefer to run the services individually:

#### 1. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn app.main:app --reload
```

#### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run the development server
npm run dev
```

Make sure you have `.env` files in both `backend/` and `frontend/` directories with the necessary credentials if running manually.

## 🏗️ Architecture

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React + Vite, Tailwind CSS, Framer Motion, Zustand |
| **Backend** | FastAPI (Python), SQLAlchemy, Pydantic |
| **Database** | PostgreSQL |
| **Deployment** | Docker Compose |

### No-Lag Audio System

Our audio engine pre-loads the next 3 tracks in the queue, ensuring seamless playback transitions without interrupting gameplay.

## 📱 Controls

- **Desktop**: Arrow keys to navigate
- **Mobile**: Swipe in the direction you want to move

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/yourusername/snakeify.git
cd snakeify

# Set up environment variables
cp .env.example .env
# Edit .env with your Spotify credentials

# Run with Docker
docker-compose up --build
```

## 👨‍💻 Created By

https://github.com/Mr-Dark-debug/SNAKEIFY

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
