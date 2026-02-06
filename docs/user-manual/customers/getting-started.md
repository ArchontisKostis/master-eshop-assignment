## Customer Getting Started

This page walks you through accessing E‑Shop, creating a **customer** account, and signing in.

---

## Accessing the Application

1. Open your browser.
2. Navigate to the E‑Shop frontend URL (default: `http://localhost:3000`).
3. You will see the **Landing Page** with:
   - The **E‑Shop** logo and **Login / Sign Up** buttons in the top bar.
   - A hero section with buttons such as **Start Shopping** and **Become a Seller**.

From here you can:

- **Log in** with an existing account.
- **Register** as a new customer.
- Explore public pages like the landing and about pages.

---

## Creating a Customer Account

1. Click **Sign Up** in the top bar, or **Create Customer Account** on the landing page.
2. On the **Create Account** screen, choose the **Customer** tab.
3. Fill in the required fields:
   - **Username** - between 3 and 50 characters.
   - **Email** - must be a valid email address, up to 100 characters.
   - **Password** - between 6 and 100 characters.
4. Submit the form.

If registration is successful:

- You are redirected to the **Login** page.
- A success message appears, asking you to log in to continue.

If something is wrong:

- Validation errors (e.g. too short username, invalid email, short password) show up as a red alert.
- Conflicts (e.g. username or email already in use) also appear as an error message.
- Fix the issue and submit again.

---

## Signing In as a Customer

1. Click **Login** in the top bar, or the **Start Shopping** button on the landing page.
2. On the **Login** page, enter your **Username** and **Password**.
3. Click **Sign In**.

If the credentials are correct:

- You are redirected to the **Customer Dashboard**.
- If you tried to open a protected page first, you are sent back there after login.

If credentials are invalid:

- An error message such as “Invalid username or password” appears above the form.
- Correct your input and try again.

---

## Staying Signed In and Logging Out

- Your session is stored in the browser, so refreshing the page keeps you signed in until:
  - The token expires, or
  - You explicitly log out.

To log out:

1. In the dashboard, look at the **sidebar**.
2. At the bottom you will see a card with your **avatar**, **username**, and **role**.
3. Click this card to open the user menu.
4. Choose **Logout**.
5. You are signed out and returned to the public home page.

