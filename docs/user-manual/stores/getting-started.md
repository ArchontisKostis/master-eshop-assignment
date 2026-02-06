## Store Owner Getting Started

This page explains how to create a **store owner** account (or use demo credentials), log in, and reach the store dashboard.

---

## Accessing the Application

1. Open your browser and go to the E‑Shop frontend URL (default: `http://localhost:3000`).
2. You will see the **Landing Page** with:
   - The E‑Shop logo.
   - **Login** and **Sign Up** buttons in the top bar.
   - Hero buttons such as **Start Shopping** and **Become a Seller**.

For store owners the key actions are **Sign Up → Store Owner** and **Login**.

---

## Creating a Store Owner Account

1. Click **Sign Up** in the top bar, or **Become a Seller** on the landing page.
2. On the **Create Account** screen, choose the **Store Owner** tab.
3. Fill in the required fields:
   - **Username** - 3-50 characters.
   - **Email** - valid email address, up to 100 characters.
   - **Password** - 6-100 characters.
   - **Tax ID** - between 9 and 12 characters (used to uniquely identify your store for business purposes).
4. Submit the form.

If registration is successful:

- You are redirected to the **Login** page.
- A success message indicates that you can now sign in.

If any input is invalid:

- A red error alert is shown (for example if the username is too short or the tax ID length is incorrect).
- If the username already exists, you will see a conflict message.
- Fix the issue and resend the form.

---

## Signing In as a Store Owner

1. Click **Login** in the top bar.
2. On the **Login** page, enter the store owner **Username** and **Password**.
3. Click **Sign In**.

If the credentials are valid:

- You are redirected to the **Store Dashboard**.

If the credentials are invalid:

- An error message is displayed above the form (e.g. invalid username or password).
- Correct the credentials and try again.

---

## Staying Signed In and Logging Out

- Your session persists across page refreshes until you:
  - Log out, or
  - The token expires.

To log out:

1. In the dashboard sidebar, look at the **user profile** block at the bottom (avatar, username, and role).
2. Click this block to open the user menu.
3. Select **Logout**.
4. You are returned to the public landing page and will need to log in again for further store management.

