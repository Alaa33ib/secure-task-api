# Secure Task Management API

A production-ready Node.js and Express RESTful API built with focus on layered security, robust input validation, and role-based access control. The application allows users to manage a shared collection of tasks while enforcing structured security parameters at every endpoint.

## Core Features

* **API Versioning:** All endpoints are structured under a versioned routing architecture (`/api/v1/...`) to ensure smooth backward compatibility.
* **Authentication & Session Management:** Implements secure user registration and login pathways utilizing `bcryptjs` for reliable password hashing and `jsonwebtoken` (JWT) for stateless session tokens.
* **Role-Based Access Control (RBAC):** Restricts dangerous system operations based on administrative tiers. Standard authenticated users can read, create, and modify tasks, while resource deletion is strictly locked to users possessing the `admin` role.
* **Strict Input Validation:** Custom middleware intercepts execution flows to inspect data payloads before database storage, preventing data corruption or empty writes.
* **Centralized Error Handling:** Uses a unified Express error-handling lifecycle to catch system faults smoothly without crashing the active server engine.
* **Interactive Documentation:** Equipped with a native Swagger UI environment built directly into the server routing layout using structural OpenAPI declarations.

---

## Technical Stack

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Security & Encryption:** jsonwebtoken, bcryptjs
* **Documentation Suite:** swagger-ui-express, yamljs
* **Database Management:** File System (`fs/promises`) locally mapped JSON arrays

---

## Local Installation

1. Clone or copy this project folder to your local machine.

2. Initialize dependencies by executing the following command in your terminal root directory:

```bash
npm install
```

3. Boot up the server process engine:

```bash
node server.js
```

---

## How to Test the API Using Swagger

The entire application can be fully exercised and verified right from your web browser without using standalone clients like Postman.

1. Start your local server using `node server.js`.

2. Open your preferred web browser and navigate directly to the interactive documentation dashboard at:

```text
http://localhost:3000/api-docs
```

### Register a Test User

* Click on the green `POST /auth/register` dropdown menu block.
* Click the **Try it out** button on the right side.
* Modify the JSON schema template parameters (e.g., set `"role": "admin"` to test full privileges or leave it as `"user"` to test restrictions).
* Click the blue **Execute** button to store the user account profile inside the storage file.

### Log In to Generate Your Access Token

* Open the `POST /auth/login` dropdown menu block.
* Click **Try it out** and enter the exact credentials you just registered.
* Click **Execute**.
* Locate the successful response body string and copy the entire alphanumeric sequence printed next to the `"token"` key.

### Authorize Your Browser Session

* Scroll back to the absolute top of the webpage.
* Click the locked **Authorize** button on the right.
* Paste your copied token string directly inside the value input field text box.
* Click **Authorize**, then click **Close**.

### Execute Task Management Actions

* The padlocks next to all protected task pathways (`GET`, `POST`, `PUT`, `DELETE`) will now be locked shut, signaling an authenticated layer.
* You can now expand these task blocks, use **Try it out**, fill in properties (`title`, `priority`, `progress`), and click **Execute** to see data operations interact with your backend files live.
