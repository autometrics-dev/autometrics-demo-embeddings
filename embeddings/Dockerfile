FROM python:3.10-slim-buster

# Define Node Exporter version
ARG NODE_EXPORTER_VERSION=1.6.1

# Install necessary packages
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Download and extract Node Exporter
RUN wget https://github.com/prometheus/node_exporter/releases/download/v${NODE_EXPORTER_VERSION}/node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64.tar.gz && \
    tar -xzf node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64.tar.gz && \
    mv node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64/node_exporter /usr/local/bin && \
    rm -r node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64.tar.gz node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64


WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD node_exporter & python app.py