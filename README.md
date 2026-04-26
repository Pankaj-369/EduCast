# EduCast Backend

Content Broadcasting System backend for teacher uploads, principal approval, and public subject-based live rotation.

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Sequelize
- JWT authentication
- bcrypt password hashing
- multer local file upload
- Joi validation
- Swagger API docs

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and update PostgreSQL credentials:

```bash
cp .env.example .env
```

3. Create a PostgreSQL database named `educast`.

4. Sync tables:

```bash
npm run db:sync
```

5. Seed demo users:

```bash
npm run seed
```

Demo credentials:

- Principal: `principal@educast.local` / `Principal@123`
- Teacher: `teacher@educast.local` / `Teacher@123`

6. Start the API:

```bash
npm run dev
```

API health check:

```text
GET http://localhost:5000/health
```

Swagger docs:

```text
http://localhost:5000/api-docs
```

## Main API Usage

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Teacher

```text
POST /api/content
GET  /api/content/my
GET  /api/content/:id
```

Upload content as `multipart/form-data`:

- `title` required
- `subject` required
- `file` required, JPG/PNG/GIF only
- `description` optional
- `start_time` optional ISO date
- `end_time` optional ISO date
- `rotation_duration` optional minutes, default 5

### Principal

```text
GET   /api/principal/content
GET   /api/principal/content/pending
PATCH /api/principal/content/:id/approve
PATCH /api/principal/content/:id/reject
```

Reject body:

```json
{
  "reason": "Incorrect file uploaded"
}
```

### Public Student Broadcast

```text
GET /api/content/live/:teacherId
GET /api/content/live/:teacherId?subject=maths
```

Rules:

- returns approved content only
- returns content uploaded by the requested teacher only
- respects start_time and end_time
- rotates independently per subject
- returns `"No content available"` when nothing is live

## Scheduling Assumption

New uploads are stored as `pending`. The assignment mentions `uploaded -> pending`; this implementation treats a successful upload as immediately submitted for approval, so the persisted workflow is `pending -> approved/rejected`.

## Notes

- Local upload files are served from `/uploads`.
- Bonus features such as Redis caching, S3 upload, analytics, and pagination can be added later.
- See `architecture-notes.txt` for system design details.
