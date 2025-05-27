FROM python:3.12.2

WORKDIR /usr/src/
COPY ./backend .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["sh", "-c", "cd src && alembic upgrade head && python main.py"]