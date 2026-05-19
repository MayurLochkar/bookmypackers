# Prowider Mini Lead Distribution System

## Setup Instructions

1. Ensure you have MongoDB running locally on `mongodb://127.0.0.1:27017` or add a `.env` file in the `backend/` folder with your `MONGODB_URI`.
2. Open the project folder.
3. Install backend dependencies: `cd backend && npm install`
4. Install frontend dependencies: `cd frontend && npm install`
5. You can start both servers simply by double-clicking the **`start_project.bat`** file located in the root folder, OR manually by running:
   - Backend: `npm start` (Runs on port 5000)
   - Frontend: `npm run dev` (Runs on port 3000)

---

## Explanations

### Allocation Algorithm
The distribution system follows these strict rules:
1. **Mandatory Check:** For a given service, the system identifies mandatory providers.
2. **Quota Check (Atomic):** It atomically checks if the mandatory provider has a `quota > 0` and decrements it. If successful, they are added to the assigned list.
3. **Fair Distribution:** The system calculates remaining slots needed (to make exactly 3 providers). It pulls the relevant provider pool.
4. **Round-Robin Rotation:** Using a dedicated `DistributionState` collection, it atomically increments a `lastAssignedIndex`. The modulo of this index against the pool's length decides the next provider.
5. If the chosen provider has `quota > 0` and is not already assigned, their quota is atomically decremented, and they are assigned. This loops until exactly 3 providers are assigned.

### Concurrency Handling
Simultaneous lead creations are a major issue in distribution systems. We handle this flawlessly by avoiding traditional `find() -> modify -> save()` patterns.
- **Atomic Operations:** All quota modifications and state updates use MongoDB's `findOneAndUpdate` with `$inc`. 
- **Example:** Incrementing the round-robin index happens inside the DB. If two requests hit simultaneously, the database strictly processes them sequentially, giving request A `index + 1` and request B `index + 2`.
- **Duplicate Protection:** Duplicate leads (same phone + same service) are blocked using a compound unique index in MongoDB.

### Webhook Safety & Idempotency
When the payment gateway triggers the quota reset:
- The request must contain an `eventId`.
- We use a `WebhookLog` collection with a unique index on `eventId`.
- If a webhook fires multiple times (due to retries or network issues), the first request processes the quota reset and stores the `eventId`. Subsequent requests either find the existing log or throw a `11000 Duplicate Key Error` on creation, immediately returning a `200 OK` without duplicating the effect.
