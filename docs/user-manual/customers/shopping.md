## Customer Shopping Guide

This page covers the full customer shopping flow:

- Navigating the app after login.
- Discovering stores and products.
- Using filters.
- Managing your cart.
- Checking out and viewing order history.

---

## Navigation After Login

Once signed in as a customer you see the **Dashboard Layout**:

- A **top bar** showing:
  - A **cart icon** with the number of items.
  - A menu button on mobile to open/close the sidebar.
- A **left sidebar** with navigation items:
  - **Dashboard** - quick overview of your activity.
  - **Marketplace** (group)
    - **Stores** - list of all stores.
    - **All Products** - cross‑store catalog with filters.
  - **My Cart** - your shopping cart.
  - **My Orders** - your order history.

Click an item in the sidebar to go to that area. On mobile, the sidebar closes automatically after selection.

---

## Using the Customer Dashboard

The **Customer Dashboard** gives a summary of your activity:

- **Key stats**
  - Items currently in your cart.
  - Total number of orders.
  - Number of different stores you have purchased from.
  - Total amount spent.

- **Recent Orders**
  - A small table with your latest orders (number, store, date, total, status).
  - Click **View All** or any order row to go to the full **My Orders** page.

- **Recommended Products**
  - A few recent products from the marketplace.
  - Each card shows title, brand, price and a **View** button to jump to the related store.

Use this page as your “home base” when shopping.

---

## Browsing Stores (Marketplace → Stores)

1. In the sidebar, open the **Marketplace** group and click **Stores**.
2. You see a grid of **store cards**, each showing:
   - Store **name**.
   - **Owner** name.
   - Number of **products** in that store.
3. Click **View Store** on any card to open that store’s dedicated page and see its products.

If there are no stores yet, an informational message is shown instead.

---

## Browsing All Products (Marketplace → All Products)

1. In the sidebar, open **Marketplace → All Products**.
2. You see:
   - A **summary line** showing how many products match your current filters.
   - A **filter button** (funnel icon) in the top‑right.
   - A grid of **product cards**. Each card shows:
     - Title.
     - Brand and type.
     - Store name (where the product is sold).
     - Price.
     - Current **stock** with a color‑coded chip.
     - An **Add to Cart** button (or **Out of Stock** if the stock is zero).

If no products match the current filters, you see a friendly “No Products Found” message.

### Product Filters

Click the **filter** button to open the filter popover:

- **Search by Title**
  - Free‑text search within product titles.

- **Store**
  - Restrict results to a single store, or choose **All Stores**.

- **Product Type**
  - Filter by type (e.g. Electronics, Clothing).

- **Brand**
  - Choose an existing brand from the list, or
  - Select **Other (Specify)** and type your own brand name.

- **Price Range**
  - **Min** - show only products priced at or above this value.
  - **Max** - show only products priced at or below this value.

Use **Apply** to keep the settings, or **Clear** to reset all filters.

---

## Managing Your Cart

Open **My Cart** from the sidebar or click the **cart icon** in the top bar.

### Cart Layout

- Items are grouped **by store**:
  - Each store block shows the **store name** and a **store subtotal**.
  - Under each store you see product rows with:
    - Title and brand.
    - Unit price.
    - Current quantity.
    - Line subtotal.
    - Optional “Only X left” stock warning.

- On the right side there is an **Order Summary** panel:
  - **Subtotal** - combined value of all items.
  - **Shipping** - shown as **FREE**.
  - **Total** - final amount to be charged.

### Changing Quantities

- Use the **-** and **+** buttons next to the quantity:
  - You cannot go below 1.
  - You cannot exceed the **available stock**.
- If you try to exceed stock:
  - A warning is displayed (for example due to a recent stock change).
  - The cart is refreshed so you see the latest available stock.

### Removing Items

1. Click the **trash** icon next to the item.
2. Confirm the removal when the browser asks you.
3. The item is removed and the totals update automatically.

### Empty Cart

If your cart has no items, you see:

- A large cart icon and the text **Your cart is empty**.
- A button to go back to the **Marketplace** and start shopping.

---

## Adding Products to the Cart

From **All Products** or from a specific **Store** page:

1. Find a product card with the **Add to Cart** button enabled.
2. Click **Add to Cart**:
   - If stock is available, the item is added to your cart (quantity 1 by default).
   - A toast message confirms the action.
3. If there is a stock issue (e.g. another user bought the last item), you see a warning message.

Products that are completely out of stock are labeled **Out of Stock**, and you cannot add them to the cart.

---

## Checkout and Placing Orders

1. From **My Cart**, click **Proceed to Checkout**.
2. On the **Checkout** page you typically review:
   - The items you are purchasing.
   - How they are split between different stores (multi‑vendor).
   - The final total.
3. Confirm to **place your order**.

During checkout the system:

- Validates current stock for each product.
- Creates **separate orders per store** while still handling your checkout as a single action.
- Updates product stock to reflect your purchase.

If any product no longer has enough stock:

- You will see an error message.
- Your cart is refreshed so you can adjust quantities and try again.

---

## Viewing Order History

1. Click **My Orders** in the sidebar.
2. You see a list of orders with:
   - Order ID.
   - Store.
   - Date.
   - Total amount.
   - Status (e.g. Pending, Completed).

Use this page to:

- Track the status of your latest purchases.
- Review how much you spent and where.

You can also reach this page quickly from the **Recent Orders** table on the dashboard by clicking **View All** or any order row.

