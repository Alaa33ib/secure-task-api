# Secure Task Management API (MongoDB Integrated Edition)

A production-ready Node.js and Express RESTful API built with a strong focus on layered security, robust database constraints, environmental safety, and role-based access control. This version upgrades the application storage engine from local files to a structured MongoDB document database while keeping the original architecture completely intact for legacy compliance.

## Core Features

* **Parallel API Versioning:** All endpoints are split across structured routing folders. Version 1 (`/api/v1/...`) handles operations via local JSON files, while Version 2 (`/api/v2/...`) utilizes an enterprise database layer to ensure zero service disruption.
* **Database Modeling & Persistence:** Leverages **Mongoose Object Modeling** to define rigid document schemas, manage data defaults, and enforce secure data isolation constraints (such as `select: false` to lock password hash visibility).
* **Authentication & Session Management:** Implements secure user registration and login pathways utilizing `bcryptjs` for password hashing and `jsonwebtoken` (JWT) for stateless session tokens.
* **Role-Based Access Control (RBAC):** Restricts dangerous system operations based on administrative tiers. Standard authenticated users can read, create, and modify tasks, while resource deletion is strictly locked to accounts possessing the `admin` role.
* **Database-Driven Validation Middleware:** Intercepts runtime traffic with validation layers. V2 lanes utilize case-insensitive asynchronous MongoDB regex queries to reject duplicate titles globally before execution hits the storage layer.
* **Environmental Isolation:** Isolates critical signature secrets and raw URI database strings completely outside the application code space using global system variables.
* **Interactive Documentation:** Equipped with a native Swagger UI environment built directly into the server routing layout using comprehensive OpenAPI 3.0 specifications.

---

## Technical Stack

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database Engine:** MongoDB (Local instance)
* **Object Modeling Layer:** Mongoose
* **Security & Encryption:** jsonwebtoken, bcryptjs, dotenv
* **Documentation Suite:** swagger-ui-express, yamljs

---

## Local Installation & Setup

1. **Clone or copy** this project folder to your local machine.

2. **Install project dependencies** by executing the following command in your terminal root directory:

```bash
npm install
```

3. **Configure your environment variables:** Create a file named exactly `.env` at the absolute root of your project folder and define the following hidden application tokens:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/taskManagerDB
JWT_SECRET=your_custom_secure_secret_string_here
```

4. **Boot up your local database instance:** Open a separate system terminal window, change directories to your local MongoDB binary installation location, and start the daemon engine process:

```powershell
.\mongod.exe
```

5. **Start your backend application server process:** Return to your main project terminal window and execute:

```bash
node server.js
```

---

## How to Test the API Using Swagger

The entire dual-version architecture can be fully exercised and verified right from your web browser without using standalone clients like Postman.

1. Ensure both your local MongoDB background server and Node application are actively running.

2. Open your preferred web browser and navigate directly to the interactive documentation dashboard at:

```text
http://localhost:3000/api-docs
```

### Registering and Testing Database Version 2 (V2)

#### Account Creation

* Expand the `POST /api/v2/auth/register` endpoint.
* Hit **Try it out**, provide a unique username/password combo, select a role configuration (`user` or `admin`), and hit **Execute**.
* The resulting payload will show a 24-character hexadecimal `_id` successfully stamped inside MongoDB.

#### Token Retrieval

* Expand `POST /api/v2/auth/login`.
* Submit those same matching credentials and click **Execute** to fetch your generated JWT security string.
* Copy the token.

#### Session Authorization

* Scroll to the absolute top of the page.
* Click the locked **Authorize** button.
* Paste the token block into the value input text box.
* Click save.

#### Executing Task CRUD Lifecycle

* The padlocks next to your protected `/api/v2/tasks` database endpoints will lock shut.
* You can now read (**GET**), generate (**POST**), change (**PUT**), and clear (**DELETE**) real task documents directly inside your live collections!
