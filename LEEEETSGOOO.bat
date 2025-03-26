@echo off

cd backend
(
echo SECRET_KEY=fj4tQHvxG55c7srYFSotUv+XHvkchI56GyBRmd9z9AM=
echo ALGORITHM=HS256
echo DB_HOST=postgres
echo DB_PORT=5432
echo DB_USER=postgres
echo DB_PASS=postgres
echo DB_NAME=postgres
echo CLIENT_SECRET=6de8f5fa-4ebc-428e-8d2d-afd8aa7a92f9
echo AUTH_DATA=OWUzYWI3NDQtMGQ4Zi00NDJjLWFkNjEtODJjY2Y2OTc4ZDE3OjZkZThmNWZhLTRlYmMtNDI4ZS04ZDJkLWFmZDhhYTdhOTJmOQ==
) > .env
cd ..

docker compose up -d --build

timeout /t 10 >nul

start http://localhost:8000/docs
start http://localhost:3000