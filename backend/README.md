# TMS-backend
Timetable management system Backend

### Build & Run
- cd into `backend/`
- run `go mod download` first to install go packages
- run directly with `go run .` command or build binary and execute it `go build . && ./tms-sever`

#### Development
- For hot-reloading install `air`: [github.com/air-verse/air](https://github.com/air-verse/air)
- Copy `.env.example` to `env`: `cp .env.example .env`
- Inside `.env` add your own postgres DATABASE_URL, Recommeneded to get from [Supabase](https://supabase.com).
