
  # Within App V2

  This is a code bundle for Within App V2. The original project is available at https://www.figma.com/design/MsgaZyVvRqC4H8T4OrhHTe/Within-App-V2.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Auth setup (Supabase + Google + Apple)

  1. Create a `.env.local` file in the project root.
  2. Add these values:

  ```
  VITE_SUPABASE_URL=your_supabase_project_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

  3. In Supabase Dashboard -> Authentication -> Providers, enable both `Google` and `Apple`.
  4. Add redirect URL(s):

  ```
  http://localhost:5173/auth/callback
  https://your-production-domain.com/auth/callback
  ```

  Notes:
  - The app includes a temporary `Bypass Login (Testing)` button.
  - OAuth buttons are enabled only when Supabase env variables are present.

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
  