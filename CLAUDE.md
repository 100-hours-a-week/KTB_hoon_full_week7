# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # serve the built dist/
npm run lint     # ESLint over the repo (html/ and dist/ are ignored)
```

No test framework is configured — there are no tests and no `test` script.

## Big Picture: a migration in progress

This repo is a board (게시판) service being rewritten from a **vanilla-JS MPA** into a **React SPA**. Two implementations coexist:

- **`html/`** — the legacy MPA and the source of truth for behavior/markup/styles. One folder per page (`login/`, `signup/`, `posts/`, `post-detail/`, `post-write/`, `post-edit/`, `profile/`, `profile-pw/`), each with its own `index.html`, plus per-page scripts/styles in `html/js/` and `html/css/`. This is **not** built or served by Vite (it's excluded from ESLint) — treat it as a reference to port from, not code to run.
- **`src/`** — the new React SPA (React 19, React Router 7, Vite 6). This is what actually builds and runs.

When implementing a page in `src/`, port structure and CSS class names from the matching `html/<page>/` + `html/css/<page>.css` + `html/js/<page>.js`. `src/App.css` is global CSS whose class names are copied verbatim from `html/css/` (no CSS Modules).

## Backend contract

The frontend talks to a **separate backend** (not in this repo) at `http://localhost:8080/api/v1` — a Spring server using JWT bearer auth. The full contract lives in `docs/api-specification.md` and is the authoritative reference for endpoints, request/response shapes, and error codes. Key conventions:

- Every response is an envelope: `{ message, code, data }`. Success `code` is `SUCCESS`; failures carry a domain error `code`.
- Auth is a JWT access token sent as `Authorization: Bearer <token>`, stored client-side in `localStorage` under `accessToken`.
- List endpoints (e.g. posts) use **cursor pagination**, not offset/page.

## Frontend conventions (follow these when adding code)

- **All network calls go through `apiFetch(path, options)` in `src/api.js`.** Pass only the path after the base URL (e.g. `apiFetch("/login", { method: "POST", body: JSON.stringify(...) })`). The wrapper prepends `BASE_URL`, attaches the bearer token from `localStorage`, and sets `Content-Type: application/json` when there's a body. `html/js/api.js` is the vanilla original; `src/api.js` is its module port — keep them conceptually in sync.
- **Error handling maps server `code` → Korean UI message.** Each form defines a local `*_ERROR_MAP` object (see `LoginForm.jsx`, `SignupForm.jsx`) and looks up `data.code` to set field-level errors, falling back to a generic message. Reuse this pattern rather than hardcoding messages inline.
- **Client-side validation lives beside the form** as small predicate helpers (`isValidEmail`, `isValidPassword`, `isValidNickname` in `SignupForm.jsx`). Validate before calling `apiFetch`.
- **Component structure:** `src/pages/*` are route-level containers (own navigation via `useNavigate`, hold success handlers like `onLoginSuccess`); `src/components/*` are reusable presentational/field pieces (`EmailField`, `PasswordField`, `Button`, etc.). Field components are controlled — they take `value`/`error`/`onChange` and delegate rendering of the input via `Input`/`HelperText`. Forms own the `useState` and pass callbacks down.
- **Routing:** add a `<Route>` in `src/App.jsx`. `BrowserRouter` wraps the app in `src/main.jsx`. Successful auth flows redirect with `navigate("/posts")` etc.

## Gotchas

- A route-level page calling `useNavigate()` (or any hook) without importing it will throw at render and blank the whole screen — imports are the usual culprit for a white page.
- `src/index.css` is imported after `src/App.css` in `main.jsx`; rules there override `App.css` at equal specificity. Keep global resets/`body` styling in `App.css` and keep `index.css` minimal.
