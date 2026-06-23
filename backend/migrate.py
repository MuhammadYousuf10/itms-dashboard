import sqlite3

def migrate():
    try:
        conn = sqlite3.connect('itms.db')
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1 NOT NULL;")
        conn.commit()
        print("Migration successful: added is_active to users")
    except Exception as e:
        print(f"Migration failed or already applied: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    migrate()
