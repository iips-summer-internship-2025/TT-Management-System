package main

import (
	"database/sql"
	"log"
	"time"
)

func connectDB() *sql.DB {
	connStr := "postgresql://postgres:[YOUR-PASSWORD]@db.tadkhffiuamvixlewpwf.supabase.co:5432/postgres"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to Supabase:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping Supabase:", err)
	}

	return db
}

func createDailySessions(db *sql.DB) {
	today := time.Now()
	weekday := today.Weekday().String() // e.g., "Monday"

	rows, err := db.Query(`SELECT id FROM lectures WHERE day_of_week = $1`, weekday)
	if err != nil {
		log.Fatal("Query error:", err)
	}
	defer rows.Close()

	for rows.Next() {
		var lectureID int
		if err := rows.Scan(&lectureID); err != nil {
			log.Println("Scan error:", err)
			continue
		}

		_, err := db.Exec(`
            INSERT INTO sessions (lecture_id, date)
            VALUES ($1, $2)
            ON CONFLICT (lecture_id, date) DO NOTHING
        `, lectureID, today.Format("2006-01-02"))
		if err != nil {
			log.Println("Insert failed:", err)
		} else {
			log.Printf("Session created for lecture_id %d\n", lectureID)
		}
	}

	log.Println("Finished creating today's sessions.")
}

func markSessionStatus(db *sql.DB, sessionID int, status string) error {
	_, err := db.Exec(`
        UPDATE sessions SET status = $1 WHERE id = $2
    `, status, sessionID)
	return err
}

func main() {
	db := connectDB()
	defer db.Close()

	createDailySessions(db)

	err := markSessionStatus(db, 3, "held")
	if err != nil {
		log.Println("Error updating session status:", err)
	} else {
		log.Println("Session status updated.")
	}
}
