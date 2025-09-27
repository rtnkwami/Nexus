# Nexus

Nexus is an e-commerce platform that enables business owners to create their own shops and advertise their products. It also provides analytics into sales revenue, product popularity, and product conversion rates.

## Running the Demo

This demo requires **PostgreSQL** running in Docker.

### Step 1: Start PostgreSQL

Run this command in your terminal to start a Postgres container:

```bash
docker run --name postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=nexus \
  -p 5432:5432 \
  -d postgres
```

This creates a Postgres container with:
- Database: `nexus`
- Username: `admin`
- Password: `admin`
- Host: `postgres` (inside Docker network) or `localhost` (from your host machine)
- Port: `5432`

**Important:**
- If you are running the API directly on your machine, set `DB_HOST=localhost`.
- If you are running the API in another Docker container on the same network, set `DB_HOST=postgres`.

### Step 2: Install backend dependencies and start the API

From the project root, install backend dependencies and run the backend:

```bash
cd api
npm install
npm start
```

### Step 3: Seed the database

From the project root, run:

```bash
node api/src/fake-data/seeder.js
```

This will insert data that will be used for the demo.

### Step 4: Install frontend dependencies and start the frontend

Start the frontend:

```bash
cd ../nexus-ui
npm install
npm run dev
```

### Step 5: Open the app

Go to http://localhost:3000 in your browser.

Log in with the credentials provided below:

- Username: `nexus.knust.demo@gmail.com`
- Password: `Bunch-Charger2-Riding`
