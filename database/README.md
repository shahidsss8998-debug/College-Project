# Database Design Reference

This folder contains the schema definitions for the MongoDB database. 

## Relationships
- **User**: Base model for all students and admins.
- **Announcement**: Linked to `User` (admin) via `createdBy`.
- **Resource**: Linked to `User` via `uploadedBy`.

## Field Explanations
- `role`: Determines access levels. Admins can manage announcements.
- `department`: Used for filtering resources (e.g., CSE, ECE, ME).
- `semester`: Used for filtering resources (1-8).
