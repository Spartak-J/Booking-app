# ��� Booking App

Система бронирования гостиничных номеров

## ��� Структура
```
booking-app/
├── frontend/     # React приложение
├── backend/      # FastAPI API
└── docs/         # Документация
```

## ��� Автор

Artem (Spartak-J) - Дипломный проект

## ��� Быстрый старт

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```
