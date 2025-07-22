# create_tables.py
from app.database import engine  # Your engine from database.py
from app.models import Base       # Your Base and models (the code you posted)

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully!")

if __name__ == "__main__":
    create_tables()
