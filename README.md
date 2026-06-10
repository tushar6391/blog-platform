# PostCraft ✍️

A full-stack blogging platform where users can write, share, and discover stories.

🌐 **Live Demo:** [postcraft-kappa.vercel.app](https://postcraft-kappa.vercel.app)

---

## Features

- 🔐 JWT Authentication (register, login, auto token refresh)
- 📝 Create, edit, and delete blog posts
- 💬 Comment on posts
- ❤️ Like and bookmark posts
- 🗂️ Filter posts by category
- 🔍 Search posts
- 📋 Draft posts before publishing
- 👤 User profiles with avatars

---

## Tech Stack

### Frontend
- React.js + Vite
- Axios (with interceptors for JWT refresh)
- React Router

### Backend
- Django REST Framework
- Simple JWT (access + refresh tokens)
- django-cors-headers
- django-filter

### Database
- PostgreSQL (hosted on Supabase)

### Deployment
- Frontend → Vercel
- Backend → Render

---

## Project Structure

```
blog-platform/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── api/       # Axios client
│   │   ├── components/
│   │   ├── context/   # Auth context
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
│
├── backend/           # Django REST API
│   ├── blog_project/  # Settings, URLs
│   ├── posts/         # Posts app
│   ├── comments/      # Comments app
│   ├── users/         # Users app
│   └── requirements.txt
│
└── render.yaml        # Render deployment config
```

---

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:
```
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register user |
| POST | `/api/auth/login/` | Login |
| POST | `/api/auth/refresh/` | Refresh token |
| GET | `/api/posts/` | List posts |
| POST | `/api/posts/` | Create post |
| GET | `/api/posts/:id/` | Get post |
| PUT | `/api/posts/:id/` | Update post |
| DELETE | `/api/posts/:id/` | Delete post |
| POST | `/api/posts/:id/like/` | Like post |
| POST | `/api/posts/:id/bookmark/` | Bookmark post |
| GET | `/api/comments/` | List comments |
| POST | `/api/comments/` | Add comment |

---

## Environment Variables

### Backend (Render)
| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | False in production |
| `ALLOWED_HOSTS` | `.onrender.com` |
| `DB_HOST` | PostgreSQL host |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_PORT` | Database port |
| `CORS_ALLOWED_ORIGINS` | Frontend URL |

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

---

## Author

**Tushar** — [github.com/tushar6391](https://github.com/tushar6391)
