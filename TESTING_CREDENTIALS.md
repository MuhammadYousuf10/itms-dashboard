# ITMS Dashboard - Testing Credentials

Use these credentials to test the various roles and functionalities of the application.

## 1. Administrative Accounts (Admin Dashboard)
Admins have full access. They can delete accounts, suspend users, and approve/reject Challan disputes or cancellation requests.

* **URL**: `http://localhost:5173/login`
* **Email**: `admin@itms.gov`
* **Password**: `admin123`

## 2. Operator Accounts (Admin Dashboard)
Operators have restricted access. They can view challans and *request* cancellations, but they cannot approve them. They also cannot manage users.

* **URL**: `http://localhost:5173/login`
* **Email**: `operator@itms.gov`
* **Password**: `operator123`
*(Note: If you haven't created this operator account yet, you can sign up for it or use any non-admin account you previously registered).*

## 3. Citizen Accounts (Public Portal)
Citizens log in using their vehicle details. They can view their specific fines, pay them, or submit disputes if they believe a fine was issued incorrectly.

* **URL**: `http://localhost:5173/citizen`

### Citizen Profile 1 (John Doe)
* **Plate Number**: `ABC-1234`
* **Chassis (Last 5)**: `12345`

### Citizen Profile 2 (Alice Smith)
* **Plate Number**: `XYZ-9999`
* **Chassis (Last 5)**: `67890`

### Citizen Profile 3 (Bob Johnson)
* **Plate Number**: `LMN-4567`
* **Chassis (Last 5)**: `11223`

### Citizen Profile 4 (Charlie Brown)
* **Plate Number**: `QWE-1111`
* **Chassis (Last 5)**: `99887`

---

## 🧪 Testing Scenarios

**Scenario 1: The Citizen Dispute Workflow**
1. Go to `http://localhost:5173/citizen`
2. Log in as **Alice Smith** (`XYZ-9999` / `67890`)
3. Click **Dispute** on one of her pending challans and type a reason.
4. Log into the admin dashboard (`http://localhost:5173/login`) as the **Admin** (`admin@itms.gov`).
5. Go to the Challans page, see the purple `CITIZEN DISPUTED` chip, hover over the Gavel `(🔨)` icon to read Alice's reason, and Approve or Reject the dispute.

**Scenario 2: Simulated Payments**
1. Go to `http://localhost:5173/citizen`
2. Log in as **John Doe** (`ABC-1234` / `12345`)
3. Click **Pay Now** on a pending challan.
4. Enter any dummy credit card numbers in the popup and click Pay.
5. The status will update to `PAID` and a "Download Receipt" button will appear.

**Scenario 3: The Operator Cancellation Workflow**
1. Log into the dashboard as an **Operator** (e.g., `operator@itms.gov`).
2. Go to the Challans page, click the 3-dot menu, and select **Request Cancellation**.
3. Log out, then log back in as the **Admin** (`admin@itms.gov`).
4. Find the red `REVIEW PENDING` challan, hover over the Help `(?)` icon to read the operator's reason, and Approve or Reject it.
