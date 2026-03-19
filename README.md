
  # Within App V2

  This is a code bundle for Within App V2. The original project is available at https://www.figma.com/design/MsgaZyVvRqC4H8T4OrhHTe/Within-App-V2.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Deploying to Vercel

  This project is configured for Vercel with [vercel.json](vercel.json).

  1. Install Vercel CLI (once):

  `npm i -g vercel`

  2. From the project root, run:

  `vercel`

  3. For production deployment:

  `vercel --prod`

  Notes:
  - Build command: `npm run build`
  - Output directory: `dist`
  - SPA routes are rewritten to `index.html` for React Router.
  