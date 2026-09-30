# AntarcticaSync: System Requirements Specification

## 1. Functional Requirements (FR)

### FR-01: Offline-First Edge Datastore & State Replication
- **FR-01.1:** System MUST run 100% functional without an active internet connection using `Dexie.js` over browser `IndexedDB`.
- **FR-01.2:** All local mutations (shift logs, inventory adjustments, fuel dipping) MUST be stored locally with deterministic UUIDs and ISO timestamps.
- **FR-01.3:** System MUST maintain a local `syncQueue` table buffering pending outbound mutation packets.

### FR-02: Interactive Link Status & Iridium Burst Simulation
- **FR-02.1:** Header MUST feature a 3-way Link Mode selector: `Online (Iridium Burst)`, `Degraded (<64 kbps)`, and `Atmospheric Blackout (Blizzard)`.
- **FR-02.2:** In Blackout mode, outbound network calls MUST be inhibited, and a badge MUST display the real-time count of pending edge-buffered packets.
- **FR-02.3:** Transitioning to Online MUST trigger an automatic burst sync flush with a visible progress indicator.

### FR-03: CRDT Conflict-Free State Convergence (Split-Screen Demo)
- **FR-03.1:** System MUST provide an interactive CRDT inspection modal showing concurrent updates from Station Edge (Bharati) and Central Command (NCPOR Goa).
- **FR-03.2:** State resolution MUST utilize Vector Clocks with Last-Write-Wins (LWW) or commutative merge rules without data loss.

### FR-04: High-Latitude South Polar Stereographic GIS (EPSG:3031)
- **FR-04.1:** Polar Map tab MUST display an authentic azimuthal South Polar Stereographic projection map centered at 90°S.
- **FR-04.2:** Map MUST plot Indian Antarctic stations (Bharati at 69°24′S 76°11′E, Maitri at 70°45′S 11°44′E) and inland traverse route across Amery Ice Shelf.
- **FR-04.3:** Map MUST display live telemetry for traverse convoy `PistenBully PB-01` (GPS coordinates, speed, fuel, VHF status) and an active countdown timer to the next Iridium satellite pass.

### FR-05: Emergency Blizzard Protocol & Smart Microgrid Load Shedder
- **FR-05.1:** UI MUST include a high-visibility Blizzard Emergency action trigger.
- **FR-05.2:** Triggering emergency MUST display the live personnel muster status (**24/24 accounted for** across station shelter modules).
- **FR-05.3:** System MUST visually shed **32 kW** of non-essential circuit loads (recreation heaters, heavy laundry) and reallocate 100% capacity to life-support radiators and clinic oxygen.
- **FR-05.4:** System MUST provide a Web Speech API button to synthesize the weather briefing aloud.

### FR-06: Madrid Protocol Environmental Ledger & Telemedicine Dossier
- **FR-06.1:** System MUST track retrograde waste drums categorized under Madrid Protocol Annex III (chemical, electronic, biohazard, incinerator ash) staged for retrieval by *MV Vasiliy Golovnin*.
- **FR-06.2:** System MUST provide an Emergency Teleconsult module that generates a compressed `<10 KB` encrypted JSON package (patient vitals, ECG trace, clinical notes) for transmission to AIIMS New Delhi.

---

## 2. Non-Functional Requirements (NFR)

- **NFR-01 (UI/UX Continuity):** Existing layout structure (header, tabs, card dimensions, high-contrast dark theme) MUST be preserved to prevent confusion.
- **NFR-02 (Judgeable Visual Feedback):** Every user action MUST produce clear, visible feedback (badge animations, toast notifications, status pill transitions) within 200ms.
- **NFR-03 (Performance):** Zero reliance on remote external CDNs or live backend APIs for core functionality; offline load time MUST be <1 second.
- **NFR-04 (Accuracy):** All displayed values MUST mathematically align with the presentation slides (e.g. 14,200 L fuel, 24/24 muster, 32 kW load shed, <64 kbps bandwidth).

---

## 3. Judge Evaluation Scenarios (Live 3-Minute Demo Script)

1. **Step 1 (The Offline Proof):** Switch network toggle to `Atmospheric Blackout`. Add a new shift handover log. Show the pending queue badge pulse: `Pending Sync: 1`. Demonstrate that the application is fully functional offline.
2. **Step 2 (The Satellite Burst):** Switch network toggle back to `Online (Iridium Burst)`. Observe the burst animation flush the queue to `0` with a cryptographic SHA-256 seal.
3. **Step 3 (The Polar Map):** Navigate to `Polar Map & Convoy`. Show the South Polar Stereographic projection (EPSG:3031) and the live PistenBully traverse convoy tracking on the Amery Ice Shelf with satellite pass countdown.
4. **Step 4 (The Emergency Response):** Click `Emergency Blizzard Protocol`. Show the instant 24/24 muster check and the automated 32 kW smart load shedding preserving life-support generators.
5. **Step 5 (The Compliance & Health):** Show the Madrid Protocol Retrograde Waste ledger and export the encrypted `<10 KB` Telemedicine dossier for AIIMS.
