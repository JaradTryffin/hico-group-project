# HICO Group Project

This project consists of a backend and frontend application. Follow the instructions below to set up and run the project.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) - used 20.11.0 

## Getting Started

### Quick Start (Using Docker)

1. Ensure Docker is installed and running on your machine.
2. From the root directory of the project, run:

```bash
docker-compose up -d
npm run start
```

This will start both the backend and frontend services.

### Manual Start

#### Backend

1. Navigate to the `backend` directory:

```bash
cd backend
```

2. Start the database:

```bash
docker-compose up -d
```

3. Install dependencies:

```bash
npm install
```

4. Start the backend server:

```bash
npm run dev
```

#### Frontend

1. Navigate to the `frontend` directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

## Running Tests

### Backend Tests

To run tests for the backend:

1. Ensure you're in the `backend` directory.
2. Run:

```bash
npm run test
```

### Frontend Tests (Cypress)

To run Cypress tests for the frontend:

1. Ensure you're in the `frontend` directory.
2. Run:

```bash
npx cypress open
```

This will open the Cypress Test Runner, where you can select and run specific tests.

## Project Structure

```
hico-group-project/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
├── frontend/
│   ├── cypress/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── README.md
```

## Additional Information

- The backend uses Prisma as an ORM and is set up with a database with PostgreSQL based on the Docker setup.
- The frontend is built with Next.js and uses Cypress for end-to-end testing.
- Make sure to check the respective `package.json` files in the backend and frontend directories for available scripts and dependencies.

## Troubleshooting

If you encounter any issues:
- Ensure all required ports are free and not used by other services.
- Check that Docker is running and properly configured.
- Verify that all environment variables are correctly set in the `.env` files.

For more detailed information, refer to the documentation in the backend and frontend directories.