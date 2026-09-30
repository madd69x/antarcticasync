# AntarcticaSync: Development Roadmap

## Phase 1: Satellite Simulation & CRDT Visual Polish
- [ ] Task 1.1: Refine Header Satellite Status banner with interactive 3-mode switch (`Online Iridium Burst`, `Degraded <64kbps`, `Atmospheric Blackout`).
- [ ] Task 1.2: Add live pulsing pending edge buffer counter with visual flush animation on reconnect.
- [ ] Task 1.3: Enhance `CrdtPlaygroundModal` to display split-screen concurrent mutations between Bharati Station and NCPOR Goa with vector clock convergence.

## Phase 2: Polar GIS (EPSG:3031) & Emergency Protocol UI
- [ ] Task 2.1: Polish `PolarMapView` with crisp high-latitude Azimuthal Stereographic projection lines, Indian station markers, and Amery Ice Shelf traverse line.
- [ ] Task 2.2: Add live telemetry HUD for convoy `PistenBully PB-01` (GPS, speed, fuel endurance, VHF link) and orbital pass countdown.
- [ ] Task 2.3: Upgrade `BlizzardLockdownModal` to showcase interactive 24/24 personnel muster status and the 32 kW smart circuit load shedder.

## Phase 3: Madrid Protocol & Telemedicine Polish
- [ ] Task 3.1: Enhance `InventoryView` with dedicated Madrid Protocol Annex III Retrograde Waste Ledger (staged barrels for *MV Vasiliy Golovnin*).
- [ ] Task 3.2: Upgrade `TelemedicineModal` to generate an encrypted `<10 KB` teleconsult dossier with ECG and vitals for AIIMS New Delhi.
- [ ] Task 3.3: Verify Web Speech API hands-free voice briefing playback across all tabs.

## Phase 4: Slide Deck Alignment & Verification
- [ ] Task 4.1: Audit all presentation slides against prototype values (fix "EGG First", "Brotil", "FrstByte", "AntarticaSync").
- [ ] Task 4.2: Run production build verification (`npm run build`) and test offline PWA functionality.
- [ ] Task 4.3: Conduct 3-minute pitch rehearsal dry run.
