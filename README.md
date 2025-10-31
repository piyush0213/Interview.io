# [Interview.io]🎓🧑‍💻

The project **"AI-Powered Real-Time Interview Coach"** is an innovative virtual platform designed to help users improve their interview skills through a range of interactive and AI-driven features.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started Locally](#-getting-started-locally)
  - [Project Setup](#project-setup)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [Running Frontend + Backend Together](#running-frontend--backend-together)
- [API Endpoints](#-api-endpoints)
- [Team Members](#-members-of-our-team-diamond-)
- [Contributors](#-contributors)
- [Contributing](#-contributing)
- [Acknowledgements](#-acknowledgements)

## 🌟 Features

- 💻 **Simulated Interview Environment**: The platform provides a **real-time** or **peer-to-peer** interview experience, allowing users to practice in a lifelike scenario using their webcam and microphone. This helps users develop time management skills and offers a flexible and convenient.

- 🤔 **Quiz Section**: The quiz system generates **dynamic questions** based on the user's inputs, **covering any domain**. The adaptive difficulty feature adjusts the complexity of questions in real-time, making it suitable for users at different experience levels.

- ❓ **AI-Based Q&A Section**: In this section, users receive **AI-Based real-time, context-specific interview questions** based on their skill level. The AI adjusts the difficulty based on the quality of the user's responses, ensuring a personalized learning experience.

- 🤵 **User Profile**: Each user has a profile that tracks personal information, professional background, core skills, and the number of completed or upcoming interviews. This helps users stay organized and prepared for their interviews.

- 🚀 **Future Enhancements**: Planned future improvements include a real-time AI generated insights, enhanced quiz security, video call functionality that supports more participants, and better integration between the overview page and upcoming interviews.

## 🛠️ Tech Stack

- **Frontend**: Vite ReactJs ⚛️, Tailwind CSS 🎨, Tailwind 🔄, SCSS 🎭
- **Backend**: Node.js 🟢, Express 🚂
- **Database**: MongoDB 🍃
- **AI Integration**: Google Gemini API, Open AI API 🧠
- **Socket.io**: For the chat and video calling functionalities 💬
- **Speech to text**: WebSpeech API 🧠

## 🚀 Getting Started Locally

### Project Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/piyush0213/IIITUNA
   ```

### Frontend Setup

1. Navigate to frontend

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

3. **Google OAuth Client ID Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Navigate to **APIs & Services → Credentials**.
   - Click **Create Credentials → OAuth Client ID**.
   - **Application type:** Web Application
   - **Authorized JavaScript origins:**
     - `http://localhost:5173` (for local development)
     - Any other frontend URI you use
   - **Redirect URIs:** Not needed for this setup
   - Click **Create** and copy the **Client ID**.

4. Set up environment variables:

   Create a `.env` file in the **frontend directory** and add **your required environment variables** according to this format:

   ```env
   VITE_API_URL='<your-backend-api-url>'
   VITE_GOOGLE_CLIENT_ID='<your-google-oauth-client-id>'
   ```

   Format also present in the frontend folder in the file [.env.example.frontend](./frontend/.env.example.frontend)

5. Start the development frontend server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to backend (**In Another Terminal**)

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

3. Set up environment variables:

   Create a `.env` file in the **backend directory** and add **your required environment variables** according to this format:

   ```bash
   JWT_SECRET=<your-preferred-jwt-secret-key>
   MONGODB_URI=<your-mongodb-connection-string>
   MONGODB_URI1=<optional>
   GEMINI_API_KEY=<your-gemini-api-key>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   CLOUDINARY_NAME=<your-cloudinary-name>
   NODE_ENV=development
   PORT=3000
   ```

   Format also present in the backend folder in the file [.env.example.backend](./backend/.env.example.backend)

4. Start the server:
   ```bash
   npm run dev
   ```

### Running Frontend + Backend Together

To run both frontend and backend simultaneously:

1. Make sure you have installed dependencies for both:

   ```bash
   npm run install-all
   ```

2. Start both servers together:

   ```bash
   npm run dev
   ```

3. Access the app:
   - **Backend** → `http://localhost:3000`
   - **Frontend** → `http://localhost:5173`

### ⚡ Extra Notes

- `npm run install-all` → Installs dependencies for both frontend and backend in one go.
- `npm run dev` → Starts both frontend and backend together using concurrently.

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/signup`: User registration
- `POST /api/v1/auth/login`: User login
- `POST /api/v1/auth/logout`: User logout
- `POST /api/v1/auth/editUser`: Edit user information
- `POST /api/v1/auth/google`: Google Login and Signup
- `GET /api/v1/auth/getAuth`: Get user authentication status
- `POST /api/v1/auth/updateAvatar`: Update user avatar

### Rooms
- `POST /api/v1/rooms/addroom/:roomID`: Add a new room
- `POST /api/v1/rooms/deleteroom/:roomID`: Delete a room
- `GET /api/v1/rooms/getroom/:roomID`: Get room information

### Quiz
- `POST /api/v1/quiz/generate-id`: Generate a quiz ID
- `POST /api/v1/quiz/generate-quiz`: Generate a quiz
- `POST /api/v1/quiz/save-answer`: Save a quiz answer
- `POST /api/v1/quiz/evaluate-answer`: Evaluate a quiz answer
- `POST /api/v1/quiz/terminate-quiz`: Terminate a quiz session

### Questions
- `POST /api/v1/questions/generate-questions`: Generate questions for a quiz
- `POST /api/v1/questions/chat`: Interact with AI chatbot

## 😎 Members of our Team Diamond 👥

- **Piyush Prajapati** - [@piyush0213](https://github.com/piyush0213)
- **Lakshya Chauhan** - [@lakshya-8000cr](https://github.com/lakshya-8000cr)
- **Parth Sharma** - [@parth-476](https://github.com/parth-476)
- **Jashan Kumar** - [@Jk-6900cr](https://github.com/Jk-6900cr)

## 🌟 Contributors

We appreciate all the contributors who have helped make Interview.io better! 🎉

<a href="https://github.com/piyush0213/IIITUNA/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=piyush0213/IIITUNA" alt="Contributors" />
</a>

### How to Contribute

We welcome contributions from everyone! Here's how you can get involved:

1. **Fork the repository** and clone it locally
2. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit them with descriptive messages
4. **Push to your fork** and submit a pull request
5. Wait for review and address any feedback

Please ensure your code follows the project's coding standards and includes appropriate tests where applicable.

## 🤝 Contributing

We welcome contributions to this project! Please feel free to:

- 🐛 Report bugs by opening an issue
- 💡 Suggest new features or enhancements
- 📝 Improve documentation
- 🔧 Submit pull requests

Before contributing, please:
- Check existing issues and pull requests
- Follow the code style used throughout the project
- Write clear commit messages
- Test your changes thoroughly

## Contributor

A heartfelt thank you to all the contributors who have dedicated their time and effort to make this project a success.  
Your contributions—whether it’s code, design, testing, or documentation—are truly appreciated! 🚀

#### Thanks to all the wonderful contributors 💖

<a href="https://github.com/piyush0213/Interview.io/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=piyush0213/Interview.io" />
</a>

## 🙏 Acknowledgements

- [Gemini](https://gemini.google.com/) for providing the AI API
- [MongoDB](https://www.mongodb.com/) for the database solution
- [Socket.io](https://socket.io/) for real-time communication capabilities
- All our amazing [contributors](#-contributors) who help improve Interview.io

---

Have a great job cracking journey with [Interview.io]! 🎓✨

**⭐ If you find this project helpful, please consider giving it a star!**
