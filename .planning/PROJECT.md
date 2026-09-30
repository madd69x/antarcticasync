# AntarcticaSync: Project Specification & SIH 2026 Strategy

## 1. Project Overview & Context
- **Hackathon:** Smart India Hackathon 2026 (SIH 2026)
- **Problem Statement ID:** SIH26060
- **Title:** Digital Platform for Efficient Remote Management of Indian Antarctic Research Stations
- **Nodal Ministry & Agency:** Ministry of Earth Sciences (MoES) & National Centre for Polar and Ocean Research (NCPOR Goa)
- **Team:** FrostByte (Team ID: 136497)
- **Core Product:** **AntarcticaSync** — A resilient, offline-first digital mission-control web platform for Bharati Station (Larsemann Hills), Maitri Station (Queen Maud Land), Himansh (Himalayas), and Himadri (Arctic).

---

## 2. Strategic Goal & Constraints
The user's direct instruction:
> *"Rethink about what we should build for our SIH prototype model according to the ppt we are attaching. We want no mistakes and the layout currently should not change alot, i.e. make judgeable changes in ui/ux display part."*

### Key Constraints & Principles:
1. **Preserve Layout Structure:** Do not tear down or radically rearrange the navigation tabs (`Overview`, `Power & Microgrid`, `Polar Map & Convoy`, `Supplies & Fuel`, `Safety & Medical`, `Sync Bridge`, `MoES HQ Coordination`). Keep the high-level wireframe familiar.
2. **Make "Judgeable" UI/UX Changes:** SIH judges evaluate prototypes during a high-pressure 3 to 5-minute live demo. Every core capability claimed on the 6 presentation slides must have an unmistakable, interactive visual component that judges can see, click, and verify in seconds.
3. **Zero Contradictions & Zero Mistakes:** The prototype UI, nomenclature, and values must match the presentation slides with zero discrepancies.

---

## 3. Presentation vs Prototype Audit (Mistakes to Fix in Slides & Code)

| Location | Issue in Presentation / Code | Correction & Implementation Plan |
| :--- | :--- | :--- |
| **Page 1 & Footers** | Team name typed as `FrstByte` (missing 'o'); Footer typed as `AntarticaSync` (missing 'c') | Standardize globally to **`Team FrostByte`** and **`AntarcticaSync`** in both slides and code. |
| **Page 3 (Layer 02)** | Card 3 states `Telemetry QoS (EGG First)` *(Typo for ECG)*; states `Brotil Delta Packaging` *(Typo for Brotli)* | Fix slides to **`Telemetry QoS (ECG First)`** and **`Brotli Delta Packaging`**. Ensure prototype QoS queue prominently highlights priority tags: `[P0: SOS / ECG]`. |
| **Page 4 (Mitigations)** | Top cards use identical Wi-Fi icons; tree branches mismatch categories | Ensure prototype visually demonstrates the exact 4 mitigations with distinct telemetry metrics: Offline Dexie Queue, CRDT vector clocks, -65°C battery status, and 32 kW smart load shedding. |
| **Page 5 (KPIs)** | Network resilience lists `<64kbps` and `>800ms` latency; Telemedicine lists `<15min` emergency triage | Highlight these realistic polar metrics directly on the prototype's top live status banner. |
| **Page 6 (GIS & Citations)** | Map of Antarctica had watermark and informal annotations; citation had typo `Repicated` | Upgrade the prototype's SVG Polar Map to display clean **South Polar Stereographic Projection (EPSG:3031)** with live traverse coordinates and satellite pass timer. |

---

## 4. Key "Judgeable" Features to Deliver in the Prototype

### A. Dynamic Satellite Link Status & Buffer Queue Counter
- **Visuals:** Top banner with 3-state radio toggle:
  - 🟢 **`Online (Iridium Burst Pass)`**
  - 🟡 **`Degraded (<64 kbps Narrowband)`**
  - 🔴 **`Atmospheric Blackout (Blizzard Attenuation)`**
- **Judgeable Interaction:** In Blackout mode, when the judge logs an entry or modifies inventory, the UI displays a live pulsing counter: `Pending Edge Buffer: +1 mutation (Queued for next satellite window)`. Toggling back to Online triggers an animated burst sync that flushes the queue to 0 in under 2 seconds.

### B. Interactive CRDT Conflict-Free Synchronization Playground
- **Visuals:** Split-screen terminal comparing **Bharati Station Edge** vs **NCPOR Goa Central Command**.
- **Judgeable Interaction:** Simulate concurrent modifications to the same generator maintenance log or fuel level while in offline blackout. Clicking "Resolve via CRDT" shows Vector Clocks evaluating monotonic timestamps and deterministically converging with **Zero Data Loss**.

### C. South Polar Stereographic GIS (EPSG:3031) & Live Traverse Telemetry
- **Visuals:** Polar azimuthal circular projection showing Antarctica from 60°S to 90°S.
- **Judgeable Interaction:** Real-time tracking of active traverse convoy **PistenBully PB-01** crossing the Amery Ice Shelf toward Bharati:
  - Live GPS coordinates: `70°14′S, 72°45′E`
  - Real-time speed: `14.2 km/h`
  - Fuel on-board: `1,420 L (Endurance: 220 km)`
  - Live countdown to next Iridium LEO constellation pass: `04m : 18s`.

### D. One-Click Blizzard Lockdown & 32 kW Smart Load Shedder
- **Visuals:** High-visibility emergency action banner.
- **Judgeable Interaction:** Activating "Emergency Blizzard Protocol":
  - Triggers automated personnel muster roll-call: **24/24 Expedition Members Accounted For**.
  - Triggers smart microgrid load shedding: Instantly switches off non-essential HVAC and laundry heaters, shedding **32 kW**, reserving 100% capacity for clinic oxygen and life-support radiators.
  - Audio briefing: One-click Web Speech button reading the emergency weather alert aloud.

### E. Madrid Protocol Environmental & Retrograde Waste Ledger
- **Visuals:** Environmental compliance card tracking Annex III zero-discharge regulations.
- **Judgeable Interaction:** Live status of hazardous, electronic, and incinerator waste barrels staged at Larsemann Hills for ship retrieval by *MV Vasiliy Golovnin*.

### F. Offline Telemedicine & AIIMS Consult Packager
- **Visuals:** Clinical triage assistant for winter-over medical emergencies (hypothermia, appendicitis, frostbite).
- **Judgeable Interaction:** One-click "Package Teleconsult Dossier" generates an encrypted, compressed `<10 KB` binary packet with ECG and vital signs ready for narrowband burst transmission to AIIMS New Delhi.
