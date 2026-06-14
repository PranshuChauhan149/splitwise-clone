# Splitwise Clone - Shared Expense Management App

## Overview

A full-stack Splitwise-inspired shared expense management application built using React, Node.js, Express, PostgreSQL, Prisma, and Socket.io.

The application allows users to:

* Register and Login
* Create and Manage Groups
* Add and Manage Expenses
* Split Expenses Equally, Unequally, By Percentage, and By Share
* View Individual and Group Balances
* Record Settlements
* Real-time Expense Chat
* PostgreSQL Data Storage

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Redux Toolkit
* React Router
* Axios
* Socket.io Client

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL (Neon)
* JWT Authentication
* Socket.io

## Deployment

### Frontend

Hosted on Vercel

### Backend

Hosted on Render

### Database

Neon PostgreSQL

## Installation

### Clone Repository

```bash
git clone https://github.com/PranshuChauhan149/splitwise-clone.git
cd splitwise-clone
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Run Backend

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5001/api
```

Run Frontend

```bash
npm run dev
```

## Features

* Authentication
* Group Management
* Expense Management
* Balance Calculation
* Settlements
* Real-time Chat
* PostgreSQL Storage

## AI Tools Used

* ChatGPT
* Cursor AI

## Repository Structure

```text
splitwise-clone/
├── frontend/
├── backend/
├── README.md
├── BUILD_PLAN.md
├── AI_CONTEXT.md
```

## Author

Pranshu Chauhan
