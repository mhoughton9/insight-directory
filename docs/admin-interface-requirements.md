# Awakening Resources Directory - Admin Interface Requirements

## Table of Contents
1. [Project Context](#project-context)
2. [Current Implementation Status](#current-implementation-status)
3. [Authentication & Access Control](#authentication--access-control)
4. [Admin Dashboard](#admin-dashboard)
5. [Resource Management System](#resource-management-system)
6. [Description Sections Management](#description-sections-management)
7. [User Suggestion Integration](#user-suggestion-integration)
8. [Bulk Import Functionality](#bulk-import-functionality)
9. [Technical Implementation Details](#technical-implementation-details)
10. [Design & UI Guidelines](#design--ui-guidelines)
11. [Implementation Phases](#implementation-phases)
12. [Technical Considerations](#technical-considerations)
13. [Reference Documentation](#reference-documentation)

## Project Context

The Awakening Resources Directory is a website that serves as a comprehensive directory for spiritual awakening, non-duality, and self-inquiry resources. It organizes resources by type (books, videos, podcasts, websites, blogs, practices, apps, retreat centers), and also lists out details about different teachers and traditions.

**Tech Stack:**
- Frontend: Next.js with React and Tailwind CSS
- Backend: Node.js with Express and MongoDB using Mongoose
- Authentication: Clerk
- Image handling: Cloudinary for optimized image storage
- Deployment: Vercel for frontend and backend, MongoDB Atlas for database

## Current Implementation Status

The project already has several admin components in place:

1. **Authentication:**
   - Clerk authentication with admin user ID whitelist
   - Protected admin routes in frontend and backend

2. **Admin Pages:**
   - `/admin` - Basic dashboard with resource processing stats
   - `/admin/resource-processor` - Tool for processing new resources
   - `/admin/resources` - Resource management page
   - `/admin/book-manager` - Specialized tool for book management

3. **Admin Components:**
   - `AdminLayout.js` - Consistent layout with navigation
   - `AdminProtected.js` - Authentication wrapper
   - `ResourceEditModal.js` - Modal for editing resources
   - Resource processing components for different resource types

4. **Backend Routes:**
   - Book management routes
   - Resource management routes
   - Resource processing routes

## Authentication & Access Control

**Current Implementation:**
- Clerk authentication is implemented via the `AdminProtected.js` component
- Admin access is restricted to a single user ID in the `ADMIN_USER_IDS` array
- Backend routes are protected with an auth middleware that verifies the Clerk user ID

**Location of Authentication Code:**
- Frontend: `/frontend/components/admin/AdminProtected.js`
- Backend: `/backend/middleware/auth-middleware.js`

**No Changes Required:** The existing authentication system is sufficient for a single administrator.

## Admin Dashboard

**Purpose:** A simple, clean, central hub for resource management and site metrics

**Key Components:**

1. **Resource Metrics Panel**
   - Display counts by resource type (books, videos, podcasts, etc.)
   - Show status breakdown (Pending vs. Posted)
   - Track processing progress

2. **Quick Actions Section**
   - Add New Resource button
   - Bulk Import button
   - View Pending Resources button


4. **Resource Table**
   - Filterable by type and status
   - Pagination if needed when the # of resources becomes larger

## Resource Management System

### Resource Creation and Editing Form

**Form Structure:**
- Single page with collapsible sections for better organization
- Responsive design with field validation
- Consistent interface for both creating new resources and editing existing ones

**Form Sections:**

1. **Basic Information**
   - Title
   - Description
   - Type selector (with dynamic form fields based on selection)
   - Status (Pending/Posted)
   - Publication date

2. **Type-Specific Details**
   - Dynamic fields based on resource type:
     - **Book:** author, ISBN, publisher, page count, etc.
     - **Video Channel:** platform, creator, etc.
     - **Podcast:** host, platform, frequency, etc.
     - **Website:** URL, update frequency, etc.
     - **Blog:** URL, author, update frequency, etc.
     - **Practice:** difficulty, duration, etc.
     - **App:** platforms, cost, etc.
     - **Retreat Center:** location, offerings, etc.


3. **Media**
   - Image upload with Cloudinary integration
   - Image preview
   - Alternative text field for accessibility

### Resource Management

**Features:**
- Simple filter system by type and status
- Pagination for large datasets
- Edit button for each resource to open the form in edit mode
- Delete button with confirmation dialog
- Batch operations for status changes (optional, if time permits)

## Description Sections Management

**Purpose:** Allow management of structured description sections for each resource type

**Implementation:**
- Each resource type has 5 specific description sections defined in `resource-section-config.js`
- Description sections editor will be part of the resource form but initially hidden for new resources
- Admin can view and edit all description sections after initial resource creation
- Placeholder "Generate with AI" button for future integration with external AI tools
- No preview panel to keep the interface simple

**Workflow:**
1. Admin creates a resource with all data except description sections
2. Resource is saved with "Pending" status
3. Admin can later edit the resource to manually add description sections or use AI generation
4. Once description sections are complete, admin can change status to "Posted"

## User Suggestion Integration

**Implementation Plan:**
- Dedicated section in admin dashboard for user suggestions that come in through the "Suggest a resource" form on the site
- Simple way to pull in the suggestion into the new resource creation form and for me to manually add the necessary details before it gets posted to the site. 


## Bulk Import Functionality

**Implementation:**
- Support for JSON upload (or just JSON paste if that's easier)
- Validation and error reporting

## Technical Implementation Details

### Frontend Structure

**New Components:**
- Enhanced AdminDashboard
- ResourceMetrics
- ResourceForm (unified form for all types)
- TypeSpecificForms (one per resource type)
- BulkImportTool
- FilterableResourceTable
- DescriptionSectionsEditor

**Enhancements to Existing Components:**
- AdminLayout (add navigation for new features)
- ResourceEditModal (expand to support all resource types)
- Remove any unnecessary features in the current setup (is it best if we just start from scratch and delete the existing admin pages? so we don't have a mix of old and new?)

### Backend Enhancements

**New API Endpoints:**
- Resource metrics aggregation
- Bulk import processing
- Simple filtering capabilities

**Updates to Existing Endpoints:**
- Standardize response formats
- Add pagination support where needed
- Enhance error handling

## Design & UI Guidelines

**Design Principles:**
- Clean, minimalist interface with neutral color palette
- Consistent spacing and typography
- Clear visual hierarchy
- Responsive design with focus on desktop experience
- Intuitive form controls

**UI Components:**
- Collapsible sections for forms
- Toggle switches for boolean fields
- Rich text editor for description fields
- Image preview

## Implementation Phases

**Phase 1: Core Dashboard**
- Simple metrics display
- Resource table with basic filtering
- Navigation structure

**Phase 2: Resource Management**
- Unified resource creation form
- Type-specific form fields
- Connection management

**Phase 3: Advanced Features**
- Bulk import tool
- User suggestion integration
- Simple filtering

## Technical Considerations

- Maintain consistent state management
- Implement proper error handling
- Ensure responsive design works on all devices
- Optimize image handling with Cloudinary
- Follow existing code style and patterns

## Reference Documentation

**Schema Documentation:**
- `/docs/resource-schema-guide.md` - Comprehensive guide to all resource types
- `/backend/models/resource.js` - Main resource model with type-specific schemas
- `/backend/models/teacher.js` - Teacher model
- `/backend/models/tradition.js` - Tradition model
- `/frontend/utils/resource-section-config.js` - Configuration for resource description sections

**Existing Admin Implementation:**
- `/frontend/components/admin/` - Admin components
- `/frontend/pages/admin/` - Admin pages
- `/backend/routes/admin-routes.js` - Admin API routes
- `/backend/controllers/admin-controller.js` - Admin controllers

**Authentication:**
- `/frontend/components/admin/AdminProtected.js` - Frontend protection
- `/backend/middleware/auth-middleware.js` - Backend protection

**Standardization:**
- All models now follow consistent patterns for:
  - Link storage and display (using `{url, label}` format)
  - Description sections with standardized fields
  - Relationship references
  - Data synchronization via middleware
