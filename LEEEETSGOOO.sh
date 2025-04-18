cd backend || exit
cat << EOF > .env
SECRET_KEY=fj4tQHvxG55c7srYFSotUv+XHvkchI56GyBRmd9z9AM=
ALGORITHM=HS256
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=postgres
CLIENT_SECRET=6de8f5fa-4ebc-428e-8d2d-afd8aa7a92f9
AUTH_DATA=OWUzYWI3NDQtMGQ4Zi00NDJjLWFkNjEtODJjY2Y2OTc4ZDE3OjZkZThmNWZhLTRlYmMtNDI4ZS04ZDJkLWFmZDhhYTdhOTJmOQ==
EOF
cd ..

docker compose up -d --build

sleep 10

start http://localhost:8080/docs
start http://localhost:3000