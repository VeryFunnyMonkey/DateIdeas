cd /home/debian/dev/sync/DateIdeas
docker compose down
docker compose build --no-cache
docker compose up -d