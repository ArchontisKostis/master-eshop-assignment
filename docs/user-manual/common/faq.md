## FAQ, Errors & Tips

This page collects frequently asked questions, common error messages, and general tips for using E‑Shop.

---

## Frequently Asked Questions

### Do I need different accounts for customer and store roles?

Yes. Each account is either a **Customer** or a **Store Owner**. If you need both roles, create two separate accounts.

### Where do I log in?

Use the **Login** button in the top bar of the landing page (default URL: `http://localhost:3000`). The same login form works for both customers and store owners.

### How do I become a seller?

On the **Sign Up** page, select the **Store Owner** tab and complete the registration form (including a valid Tax ID). After that, log in using your new credentials and you will see the **Store Dashboard**.

### Can I keep shopping after placing an order?

Yes. After you complete checkout, you can return to the **Marketplace** or **All Products** and continue shopping. Each new checkout creates new orders.

---

## Common Error Messages

### “Invalid username or password”

This appears on the **Login** page when the credentials do not match any existing account.

What to do:

- Check for typos in username and password.
- Make sure you are using the right account for your role.
- If you still cannot sign in, contact your administrator.

### “Username, email or tax ID already exists”

Shown on the **Registration** page when:

- The chosen username, email, or Tax ID is already in use.

What to do:

- Choose a different username or email.
- Verify that you typed the Tax ID correctly.

### “Failed to load products / stores / orders”

These messages appear when the frontend cannot fetch data from the backend, often due to network or server issues.

What to do:

- Refresh the page.
- If the problem persists, ask your administrator to check the backend service.

### “Insufficient stock for this product”

Occurs when you try to:

- Increase item quantity in the cart beyond available stock, or
- Add an item to the cart but the stock has changed (another customer bought it).

What to do:

- Reduce the quantity to the allowed amount.
- Refresh the cart so it reflects the latest available stock.

### Unauthorized / Forbidden Page

You see this page when you try to open a route that your role is not allowed to access, e.g.:

- A store owner tries to open a customer‑only page.
- A customer tries to open a store‑only management page.

What to do:

- Use the sidebar to navigate to pages that match your role.
- If you believe you should have access, contact your administrator.

### Not Found (404) Page

Shown when the URL does not correspond to any route in the application.

What to do:

- Click the provided link/button to go back to the home page or dashboard.
- Use the sidebar or header navigation to find the desired section.

---

## General Tips & Best Practices

- **Stay logged in only on trusted devices**
  - Because the app keeps you signed in via browser storage, avoid staying logged in on shared or public computers.

- **Watch stock indicators**
  - “Only X left” and red **Out of Stock** labels help you avoid checkout surprises.

- **Understand multi‑store orders**
  - If you buy from multiple stores in one checkout, the system creates one order per store.
  - Customers see all their orders on **My Orders**; store owners only see orders for their own store.

- **Use demo accounts for testing**
  - In development setups, use the predefined customer and store accounts to explore features without affecting real data.

