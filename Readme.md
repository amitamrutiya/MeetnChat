# Description

This project is a real-time communication application offering various communication options including one-to-one and group video calls, meetings, and text chats. Built using Next.js, TypeScript, Socket.io, Auth0 for authentication, MongoDB for database storage, and Tailwind CSS for styling. The application enables seamless communication and collaboration among users.

## Features

- **One-to-One Video Call:** Initiate direct video calls with other users for one-on-one communication. Experience real-time video streaming with low latency.

- **Group Video Call:** Host video calls with multiple participants for collaborative discussions or social gatherings. Enjoy real-time interaction with friends, colleagues, or family members.

- **One-to-One Meeting Call:** Conduct personalized one-to-one meetings with colleagues or clients. Experience faster connection speeds for efficient communication and decision-making.

- **Group Meeting Call:** Organize meetings with larger groups for discussions, presentations, or brainstorming sessions. Engage with multiple participants simultaneously to enhance collaboration.

- **One-to-One User Chat:** Engage in private text conversations with individual users. Experience instant message delivery for seamless communication, enabling quick exchange of ideas or information.

- **Group User Chat:** Participate in group chats with multiple users for collaborative discussions or coordination. Enjoy real-time messaging with the added benefit of engaging with a larger community simultaneously.

- **Talk with Random:** Connect with a random user for spontaneous conversations. Experience the excitement of meeting new people and exchanging ideas on various topics.


## Technologies Used

- **Next.js:** A React framework for building server-side rendered and static web applications.
- **TypeScript:** A typed superset of JavaScript that enhances code readability and maintainability.
- **Socket.io:** A library enabling real-time, bidirectional communication between web clients and servers.
- **Auth0:** A platform for authentication and authorization.
- **MongoDB:** A NoSQL database for storing user data, messages, and call logs.
- **Tailwind CSS:** A utility-first CSS framework for building custom user interfaces.

## Setup Instructions

1. Clone the repository to your local machine.
```
https://github.com/amitamrutiya2210/MeetnChat
```

2. Navigate to the project directory.
```
cd MeetnChat
```

### Backend Setup

3. Navigate to the Backend Directory:
```
cd backend
```

4. Install dependencies using npm.
```
npm install
```

5. Run Backend Server
```
npm run start
```

### Frontend Setup

6. Navigate to the Frontend Directory:
```
cd frontend
```

7. Install dependencies using npm.
```
npm install
```

8. Copy the sample environment variables file and rename it to `.env.local`
```
cp sample.env.local .env.local
```

9. Edit the .env file and fill in the required values for environment variables such as database
connection URI, session secret, etc.

10. Start the server.
```
npm run dev
```

11. Access the application through your web browser at http://localhost:3000.

> **Note**: The frontend and backend should be running simultaneously for the full functionality of the application.

## Usage
1. Sign up or log in using Auth0 authentication.
2. Navigate to the desired communication feature (video call, meeting call, or chat).
3. Initiate or join a call/chat room.
4. Enjoy seamless real-time communication with other users.

## Deployment
This project is not deployed yet. This project is in a development phase. We will deploy it soon.

## Contributing
We welcome contributions from the community. This project is still in a very initial level, so let's work together to make it bigger. Feel free to make any additional adjustments or customize it further to better suit your project's specific details and style.