## Navigation & Layout

This page describes the common navigation patterns and layout for both **customers** and **store owners**.

---

## Public Area (Before Login)

When you open the application URL (default: `http://localhost:3000`), you see the **public landing page**:

- **Top bar**
  - E‑Shop logo (links to home).
  - **Login** button.
  - **Sign Up** button.

- **Main content**
  - A hero section explaining the marketplace.
  - Buttons such as **Start Shopping** (go to Login) and **Become a Seller** (go to registration).

From this public area you can:

- Log in with existing credentials.
- Register as a **Customer** or **Store Owner**.

Protected pages (dashboards, marketplace, cart, orders, etc.) will redirect you to the login page if you are not authenticated.

---

## Dashboard Layout (After Login)

After logging in, both customers and store owners see the **dashboard layout**, which consists of:

- **Top app bar**
  - Shows the current dashboard title:
    - `Customer Dashboard` for customers.
    - `Store Dashboard` for store owners.
  - For customers, a **cart icon** with the number of items in the cart.
  - A **menu icon** on small screens to open the sidebar.

- **Sidebar (left drawer)**
  - Contains the main navigation links for your role.
  - Can be opened/closed on mobile using the menu icon.

- **Main content area**
  - Displays the current page (dashboard, marketplace, products, orders, etc.).

- **User profile section (bottom of sidebar)**
  - Shows your avatar (first letter of your username).
  - Displays your username and role (Customer or Store Owner).
  - Clicking it opens the user menu with a **Logout** action.

---

## Customer Navigation

Customers see the following sidebar items:

- **Dashboard**
  - Overview of shopping activity, recent orders, and recommended products.

- **Marketplace** (group)
  - **Stores** - list of all stores with owner and product counts.
  - **All Products** - cross‑store catalog with filters and “Add to Cart” buttons.

- **My Cart**
  - Current shopping cart, grouped by store with an order summary.

- **My Orders**
  - Full order history with totals and statuses.

Customers also see a **cart** icon in the top app bar that links directly to **My Cart** and shows the current item count.

---

## Store Owner Navigation

Store owners see a slightly different sidebar:

- **Dashboard**
  - High‑level overview of store performance (orders, key stats).

- **Products**
  - The **My Products** table where you:
    - Add new products.
    - Edit or delete existing products.
    - Update stock levels.

- **Orders**
  - Orders placed for your store only (multi‑store orders are already split per store).

Store owners do not see customer‑only items such as **My Cart** or **My Orders**.

---

## Special Pages

- **Unauthorized / Forbidden**
  - If you attempt to access a page that your role is not allowed to see, you are redirected to an **Unauthorized** page explaining that you lack permission.

- **Not Found (404)**
  - If you visit an unknown URL, you see a **Not Found** page with a way to navigate back to a known area (such as the home or dashboard).

