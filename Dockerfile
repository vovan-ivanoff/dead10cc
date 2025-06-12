FROM python:3.12.2

WORKDIR /usr/src/
COPY ./backend .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install watchfiles

EXPOSE 8080

CMD ["sh", "-c", "cd src && alembic upgrade head && watchfiles 'python main.py' ."]