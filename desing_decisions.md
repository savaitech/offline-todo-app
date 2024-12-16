# Design Decisions for Hackathon

This document outlines the design decisions for the offline todo app, Hackathon.

1. **Offline-First Approach**
    - Prioritizes offline functionality.
    - Local storage is the single source of truth when offline.
    - Syncs with the server in the background when online.

2. **Storage Switching Using Strategy and Factory Patterns**
    - Supports flexible storage options (e.g., LocalStorage, Sqlite).
    - Enhances maintainability and scalability.

3. **Single Source of Truth in Global State**
    - Centralized global state ensures data consistency.
    - Simplifies state management and debugging.

4. **Sync Logic Centralization**
    - Centralized module handles syncing, conflict resolution, and data merging.
    - Ensures consistent and predictable data flow.

5. **Separation of Concerns**
    - Modularizes key functionalities:
      - `syncTasks` for task synchronization.
      - `resolveConflicts` for conflict resolution.
    - Improves testability and code readability.

6. **Periodic Background Sync**
    - Uses `setInterval` to sync tasks every minute.
    - Ensures data consistency without user intervention.

7. **Robust Offline Support**
    - Local storage is the primary data source when offline.
    - Handles state transitions gracefully when reconnecting.

8. **Retry with Backoff**
    - Implements retry logic with exponential backoff for network requests.
    - Ensures reliable data synchronization even with intermittent network issues.

9. **Maintainability and Performance**
    - Uses design patterns for simplified code structure.
    - Centralizes key functionalities for easier debugging.

These decisions ensure Hackathon provides a reliable, scalable, and user-friendly task management experience, even with network challenges.
