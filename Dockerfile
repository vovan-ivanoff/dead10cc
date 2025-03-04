FROM python:3.12.2

WORKDIR /usr/src/
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./backend .
EXPOSE 8000

CMD ["sh", "-c", "cd src && alembic upgrade head && python main.py"]
