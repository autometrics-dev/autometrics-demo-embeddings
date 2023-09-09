# Set up postgres with pgvector extension

FROM postgres:15

RUN apt-get update \
    && apt-get install -y postgresql-common ca-certificates

RUN /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y

# Install build tools and pgvector
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       postgresql-server-dev-15 \
       postgresql-15-pgvector \
       wget \
    && apt-get purge -y --auto-remove wget build-essential
 
