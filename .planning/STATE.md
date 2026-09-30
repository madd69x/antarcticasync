# AntarcticaSync: Project State & Memory

## Current Status
- **Status:** Initialized via `/gsd-new-project`
- **Active Milestone:** v1.0 SIH 2026 Prototype Polish
- **Current Phase:** Phase 1 (Satellite Simulation & CRDT Visual Polish)
- **Last Updated:** 2026-09-30

## Key Decisions Made
1. **Layout Integrity:** Preserve the established top navigation tabs and card layout. Make judgeable visual enhancements to badges, HUDs, modals, and telemetry indicators without restructuring the user journey.
2. **Technical Alignment:** Prototype code and presentation slides must mathematically and terminologically match:
   - Bandwidth: `<64 kbps Narrowband` (NOT 10 Gbps).
   - Storage: `Dexie.js / IndexedDB` offline persistence.
   - GIS: `EPSG:3031 South Polar Stereographic Projection`.
   - Microgrid: `32 kW Smart Load Shedding`.
   - Muster: `24/24 Expedition Members`.
3. **Judge Interaction Priority:** Ensure the 5 evaluation scenarios in `REQUIREMENTS.md` can be demonstrated in under 3 minutes with high visual impact.

## Next Steps
- Begin Phase 1: Review and enhance `SatelliteBanner.tsx`, `Header.tsx`, and `CrdtPlaygroundModal.tsx`.
