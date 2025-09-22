<h1 align="center">✨ Contributors Guide ✨</h1>

<h3 align="center">Welcome to the Interview.io! 😍<br>
We appreciate your interest in contributing.😊<br> </h3>

First off, thank you for considering contributing to **Interview.io!** We're excited to have you join our community. Every contribution, no matter how small, helps us build the best academic resource platform for students.

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

This guide will walk you through the entire contribution process, from setting up your local environment to submitting a polished pull request.

> **New to Open Source?** No problem! This guide is designed to be beginner-friendly. If you get stuck, don't hesitate to open an issue or ask for help.

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## 📋 Table of Contents

1. [Code of Conduct](#-code-of-conduct)
2. [License](#-license)
3. [Ways to Contribute](#-ways-to-contribute)
4. [Points & Difficulty Levels](#-points--difficulty-levels)
5. [Contribution Guidelines](#-contribution-guidelines)
6. [PR review Process](#-pr-review-process)
7. [Project setup & installation steps](#-project-setup)
8. [How To Contribute](#-how-to-contribute)
9. [Need More Help](#-need-more-help)
10. [Attribution](#-attribution)
11. [Thank you for your contribution](#thank-you-for-your-contribution)

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## 📜 Code of Conduct

We expect all contributors to follow our [`Code of Conduct`](https://github.com/piyush0213/Interview.io/blob/main/CODE_OF_CONDUCT.md).

By participating in this project, you agree to maintain a **respectful and inclusive environment** for everyone.

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the [`Coming Soon`].

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## 🤝 Ways to Contribute

You can contribute in several ways:
- **🐞 Report Bugs:** Submit issues for reproducible bugs.
- **💡 Suggest Features:** Propose new ideas or improvements.
- **📖 Improve Documentation:** Enhance clarity, grammar, or structure.
- **⚡ Add Code:** Fix bugs, build new features, or optimize existing ones.
- **🧪 Test:** Help us find issues by testing code in different environments.

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## 🎯 Points & Difficulty Levels

Your contributions earn points that count toward GSSoC'25 and your Interview.io Leaderboard status!

| Difficulty | Points |
| :--------- | :----- |
| Level 1 | 3 |
| Level 2 | 7 |
| Level 3 | 10  |

> **Note:** The scoring system applies only to GSSOC contributors.

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## 💡 Contribution Guidelines

* **Code Style**: Use clean, readable code with meaningful names.
* **UI Consistency**: Follow the modern UI style with animated gradients.
* **Responsive Design**: Ensure changes work on both desktop and mobile.
* **Commit Messages**: Use descriptive commit messages.

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## ✅ PR Review Process

We aim to keep things smooth and transparent:

* Once your PR is submitted, a maintainer will review it.
* You may be asked to:
  * Fix styling issues.
  * Add missing documentation/tests.
  * Break large PRs into smaller pieces.
* After approval:
  * Your PR will be merged with a squash merge to keep history clean.
  * You’ll receive feedback, even if the PR isn’t merged immediately.
* ⌛ Reviews may take **24–72 hours** depending on activity. Thanks for your patience!

 > For Any Query, Send DM on LinkedIn [`Piyush`](https://www.linkedin.com/in/piyushprajapati0213/).

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## 🚀 Project Setup & Installation Steps

### Project Setup

1. Clone the repository:

   `git clone https://github.com/piyush0213/IIITUNA`

### Frontend Setup

1. Navigate to frontend

   `cd frontend`

2. Install dependencies:

   `npm i`

3. Set up environment variables:

   Create a `.env` file in the **frontend directory** and add **your required environment variables** according to this format:

   `VITE_API_URL='<your-backend-api-url'`

   Format also present in the frontend folder in the file [.env.example.frontend](./frontend/.env.example.frontend)
   <br>

4. Start the development frontend server:

   `npm run dev`

### Backend Setup

1. Navigate to backend(**In Another Terminal**)

   `cd backend`

2. Install dependencies:

   `npm i`

3. Set up environment variables:
   Create a `.env` file in the **backend directory** and add **your required environment variables** according to this format:

   ```bash
   JWT_SECRET=<your-preferred-jwt-secret-key>
   MONGODB_URI=<your-mongodb-connection-string>
   MONGODB_URI1=<optional>
   GEMINI_API_KEY=<your-gemini-api-key>
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   CLOUDINARY_NAME=
   NODE_ENV=development
   PORT=3000
   ```

   Format also present in the backend folder in the file [.env.example.backend](./backend/.env.example.backend)
   <br>

4. Start the server:

   `npm run dev`

### Running Frontend + Backend Together

To run both frontend and backend simultaneously:

1. Make sure you have installed dependencies for both:

   `npm run install-all`

2. Start both servers together:

   `npm run dev`

3. Access the app:

   Backend → http://localhost:3000

   Frontend → http://localhost:5173

⚡ Extra Notes:

npm run install-all → Installs dependencies for both frontend and backend in one go.

npm run dev → Starts both frontend and backend together using concurrently.

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## How To Contribute

- Drop a Star ⭐ in this repo
- Take a look at the existing [**Issues**](https://github.com/piyush0213/Interview.io/issues). 
- Fork the Repo & create a branch for any issue that you are working on and commit your work.
- At first raise an issue in which you want to work
- Then after assigning only then work on that issue & make a PR 
- Create a [**Pull Request**](https://github.com/piyush0213/Interview.io/pulls), which will be promptly reviewed and given suggestions for improvements by the community.
- **REMINDER: Don't raise more than 2 `Issue` at a time**
- **IMPORTANT: Don't make any type of `Pull Request` until & unless you get assigned to an `Issue`**
- Add screenshots or screen captures to your `Pull Request` to help us understand the effects of the changes that are included in your commits.

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

<h2 align="center">Need More Help? 🤔</h1>

<p align="center"> You can refer to the following articles on basics of Git and Github and also contact the Project Mentors, in case you are stuck: <br>
  <a href="https://help.github.com/en/desktop/contributing-to-projects/creating-an-issue-or-pull-request">How to create a Issue</a> <br>
  <a href="https://help.github.com/en/github/getting-started-with-github/fork-a-repo">Forking a Repo</a> <br>
  <a href="https://docs.github.com/en/get-started/quickstart/fork-a-repo#cloning-your-forked-repository">Cloning a Repo</a> <br>
  <a href="https://opensource.com/article/19/7/create-pull-request-github">How to create a Pull Request</a> <br>
  <a href="https://docs.github.com/get-started">Getting started with Git and GitHub</a> <br>
</p>

<h3 align="center">Show some &nbsp;❤️&nbsp; by &nbsp;🌟&nbsp; this repository!</h3>

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## 🏅 Attribution

This **CONTRIBUTING.md** was prepared with **❤️** by  [`DIVYA JAIN`](https://github.com/DivyaJain-DataAnalyst) for **Interview.io** as part of the **GSSoC'25 program.**

The structure and recommendations follow **GitHub Open Source Guides** and best practices used in leading open-source repositories.

![Line](https://user-images.githubusercontent.com/85225156/171937799-8fc9e255-9889-4642-9c92-6df85fb86e82.gif)

## 👍 Thank you for your contribution!!

<h3 align="center">
Thank you for contributing to Interview.io 🌟
 <br>
We can't wait to see what you build! 🍽️✨
</h3>
