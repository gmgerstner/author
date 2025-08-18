# George M. Gerstner - Author Website

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

A professional author website built with React, featuring book listings, news updates, and contact functionality.

## Features

- Responsive design with modern glass-morphism effects
- Book series showcase with availability status
- News and updates section with Markdown support
- Contact form integration with Web3Forms
- Social media integration
- Google Analytics for visitor tracking

## Setup Instructions

### 1. Basic Setup

In the project directory, you can run:

#### `npm install`
Installs all project dependencies.

#### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `npm run build`
Builds the app for production to the `build` folder.

### 2. Google Analytics Setup

To track website visitors and page views:

1. **Create Google Analytics Account**
   - Go to [Google Analytics](https://analytics.google.com)
   - Sign in with your Google account
   - Click "Start measuring"
   - Create an account name (e.g., "George Gerstner Author Site")
   - Add a property name (e.g., "Author Website")
   - Choose your reporting time zone
   - Select "Web" as your platform
   - Enter your website URL: `https://gmgerstner.github.io/author`

2. **Get Your Measurement ID**
   - You'll receive a **Measurement ID** that looks like `G-XXXXXXXXXX`
   - Copy this ID

3. **Update the Website**
   - Open `public/index.html`
   - Find the two instances of `GA_MEASUREMENT_ID`
   - Replace both with your actual measurement ID
   - Example: Replace `GA_MEASUREMENT_ID` with `G-ABC123XYZ`

4. **Deploy Changes**
   - Commit and push your changes to GitHub
   - GitHub Actions will automatically deploy the updated site
   - Wait 24-48 hours for data to start appearing in Google Analytics

### 3. Contact Form Setup

The contact form uses Web3Forms service:
- The form is already configured with an access key
- Messages will be sent to the configured email address
- No additional setup required

### 4. Content Management

Update website content by editing these JSON files:

- **`src/data/author.json`** - Author bio, social links, profile image
- **`src/data/books.json`** - Book series, titles, availability, cover images
- **`src/data/news.json`** - News updates and announcements

## Available Scripts

### `npm test`
Launches the test runner in the interactive watch mode.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time.

## Deployment

This site is configured for GitHub Pages deployment:

1. Push changes to the `main` branch
2. GitHub Actions automatically builds and deploys the site
3. Site is available at: `https://gmgerstner.github.io/author`

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Google Analytics Dashboard

Once set up, you can access your analytics at:
- [Google Analytics Dashboard](https://analytics.google.com)
- View real-time visitors, page views, traffic sources, and more
- Track which book pages are most popular
- Monitor the effectiveness of social media links

## Troubleshooting

- **Analytics not showing data**: Wait 24-48 hours after setup
- **Contact form not working**: Check Web3Forms configuration
- **Images not loading**: Ensure images are in the `public` folder
- **Deployment issues**: Check GitHub Actions logs for build errors