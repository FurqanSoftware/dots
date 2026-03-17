FROM node:24-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

ARG MAXMIND_LICENSE_KEY
RUN apt-get update && apt-get install -y curl && \
    curl -sSL "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz" | \
    tar -xz --strip-components=1 --wildcards '*.mmdb' && \
    apt-get purge -y curl && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

EXPOSE 8080

CMD ["npm", "start"]
