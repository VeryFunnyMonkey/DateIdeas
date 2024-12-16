# Date Ideas

Date Ideas is a web application designed to help you create, organise, and select random date ideas. The application includes features such as date location autocomplete using Google Maps API, and real-time updates using SignalR.

<p align="center">
  <img width="320" alt="UI Screenshot" src="https://github.com/user-attachments/assets/3b9e84dc-51b8-46cc-b96e-4cad52164c97"> 
</p>

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- Location autocomplete using Google Maps API
- Real-time updates using SignalR
- Add, edit, and delete date ideas
- Filter date ideas by tags

## TODO
- Build authentication and user account management
- Add 'description' field to date idea

## Technologies

- Frontend: React, Tailwind CSS, Vite
- Backend: ASP.NET Core, Entity Framework Core, SignalR
- Database: SQLite
- Containerization: Docker, Docker Compose

## Prerequisites

- Docker and Docker Compose installed on your machine
- Google Maps API key

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/date-ideas.git
   cd date-ideas
   ```
2. Create a .env file in the root directory and add your Google Maps API key:
    ```
    GOOGLE_MAPS_API_KEY=your-google-maps-api-key
    ```
3. Build and start the application using Docker Compose:
    ```sh
    docker-compose up --build
    ```
### Running the Application
Once the application is running, you can access it at ```http://localhost:3000```

### Environment Variables
* ```GOOGLE_MAPS_API_KEY```: Your Google Maps API key
* ```FRONTEND_URL```: The URL of the frontend application (default: ```http://frontend:3000```)

## License
This project is licensed under the MIT License. See the LICENSE file for details.
