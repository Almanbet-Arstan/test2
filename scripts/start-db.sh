docker run --rm \
    --name test \
    -e POSTGRES_PASSWORD=a1l2m3a4 \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=test \
    -p 5432:5432 \
    -v test-vol:/var/lib/postgresql/data \
    postgres