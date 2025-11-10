# Agent Assist - Professional Errand Services App

A React app for managing errand and sign placement services for real estate agents.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Deployment to Vercel (Recommended)

### Step 1: Push to GitHub
1. Create a GitHub account (if you don't have one)
2. Create a new repository named `agent-assist`
3. Upload all files from this folder to GitHub

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your `agent-assist` repository
5. Click "Deploy"
6. Your app will be live at a URL like `agent-assist.vercel.app`

### Step 3: Embed in Squarespace
1. Go to your Squarespace page editor
2. Add a "Code Block"
3. Paste this code:
```html
<iframe 
  src="https://YOUR-VERCEL-URL.vercel.app" 
  width="100%" 
  height="800" 
  frameborder="0" 
  style="border: none; border-radius: 8px;">
</iframe>
```
Replace `YOUR-VERCEL-URL` with your actual Vercel URL

4. Adjust the height as needed

## Building for Production

```bash
npm run build
```

This creates a production build in the `build` folder.

## Environment Variables

If you need to add environment variables:
1. Create a `.env` file in the root directory
2. Add your variables: `REACT_APP_VARIABLE_NAME=value`
3. Access them in code with: `process.env.REACT_APP_VARIABLE_NAME`

## Customization

- Update colors and styling in `src/index.css`
- Modify form fields and logic in `src/App.jsx`
- Update the Formspree endpoint if needed

## Support

For issues or questions, check the React documentation at https://reactjs.org
