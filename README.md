# Dots

Dots is a DNS lookup and networking toolkit by [Furqan Software](https://furqansoftware.com).

It provides a web interface for querying DNS records (A, AAAA, CNAME, MX, NS, SOA, SRV, TXT, NAPTR, PTR), reverse DNS, WHOIS, and GeoIP lookups.

## Setup

Copy `env-sample.txt` to `.env` and configure:

```
PORT=5000
NAMESERVERS=8.8.8.8,8.8.4.4
GEOIP_DB=GeoLite2-Country.mmdb
MAPBOX_TOKEN=<your mapbox token>
```

- **NAMESERVERS** (required): comma-separated list of DNS servers.
- **GEOIP_DB** (required): path to a [GeoLite2 Country](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) `.mmdb` file.
- **MAPBOX_TOKEN** (required): Mapbox GL access token for the Geo map.

## Running

```
npm install
npm start
```

## Docker

```
docker build -t dots .
docker run -p 8080:8080 dots
```

## License

FreeBSD
