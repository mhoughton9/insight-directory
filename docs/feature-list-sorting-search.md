# Requirements Document & Implementation Plan: List Sorting and Search

**1. Introduction & Goal**

*   **Project:** Awakening Resources Directory
*   **Feature:** Implement user controls for sorting and basic searching on primary content listing pages.
*   **Goal:** Enhance content discovery by allowing users to reorder lists (alphabetically or randomly) and filter lists based on simple text search, while maintaining the existing minimalist dark theme aesthetic and ensuring site stability.

**2. Scope**

*   **Affected Pages:**
    *   Resource Type Listing Pages (e.g., `/resources/type/book`, `/resources/type/video`, etc.)
    *   Teacher Listing Page (`/teachers`)
    *   Tradition Listing Page (`/traditions`)
*   **Features to Implement:**
    *   Sort control (Dropdown for standard sorts).
    *   Randomize control (Dedicated button).
    *   Basic search input field.
*   **Out of Scope (Initial Implementation):**
    *   Advanced search filters (tags, date ranges, etc.).
    *   Saving user sort/search preferences.
    *   Backend-driven search/randomization across paginated results (as pagination will be removed).

**3. Detailed Requirements**

*   **3.1. UI Controls:**
    *   **Placement:** A single row containing the controls will be added above the list of items on each affected page.
    *   **Sort Dropdown:**
        *   Appearance: A standard dropdown menu styled consistent with the site's dark theme (navy background, light text).
        *   Options: Dynamically populated based on the content type (see 3.2). Default selection should be the primary alphabetical sort (e.g., "Title A-Z" or "Name A-Z").
        *   Behavior: Selecting an option updates the list order accordingly.
    *   **Randomize Button:**
        *   Appearance: A button styled consistently, placed near the sort dropdown. It should use a relevant Lucide icon (e.g., `Shuffle`).
        *   Behavior: Clicking the button shuffles the *entire* list of items for that page into a random order. Subsequent clicks re-shuffle. Clicking this button may visually reset or disable the Sort Dropdown to indicate it's not controlling the order.
    *   **Search Input:**
        *   Appearance: A standard text input field styled consistently, possibly with a Lucide `Search` icon inside or adjacent. Placeholder text like "Search titles..." or "Search names..." should be used.
        *   Behavior: As the user types, the displayed list should filter in real-time to show only items matching the search term (see 3.3).

*   **3.2. Sorting Logic:**
    *   **Mechanism:** Client-side sorting will be applied to the full list of items fetched from the API.
    *   **Alphabetical Sort:** The default sort order. The API will provide the initial data sorted this way. Client-side logic will re-apply this sort if selected after randomization.
        *   Resources: Sort by `title` (case-insensitive).
        *   Teachers: Sort by `name` (case-insensitive).
        *   Traditions: Sort by `name` (case-insensitive).
    *   **Type-Specific Sorts (Examples - can be added iteratively):**
        *   Books: Potential 'Author (A-Z)' option (sorting by `author[0]` or a derived primary author field).
    *   **Randomize Sort:** A client-side shuffle algorithm (e.g., Fisher-Yates) applied to the full list of items fetched from the API.

*   **3.3. Search Logic:**
    *   **Mechanism:** Client-side filtering will be applied to the currently sorted/shuffled list.
    *   **Matching:** Case-insensitive substring matching.
    *   **Target Fields:**
        *   Resources: Primarily search the `title` field. (Consider expanding to tags or description later if needed).
        *   Teachers: Primarily search the `name` field.
        *   Traditions: Primarily search the `name` field.
    *   **Behavior:** Filtering occurs as the user types (debounced slightly, e.g., 300ms, to avoid excessive re-renders).

*   **3.4. Pagination Removal:**
    *   Existing pagination controls and logic will be removed from the scoped listing pages.
    *   All relevant items for the page (e.g., all books, all teachers) will be fetched and rendered in a single list.

*   **3.5. Performance:**
    *   **Initial Approach:** Fetch all (~200-300 max, most won't have nearly this many) items initially. Handle all sorting, shuffling, and filtering on the client.
    *   **Monitoring:** Performance will be manually assessed during testing, especially scrolling and interaction responsiveness on pages with ~200+ items.
    *   **Contingency:** If significant lag is observed, list virtualization (`react-window` or similar) will be implemented as a follow-up optimization.

**4. Technical Approach**

*   **Backend API:**
    *   Modify `getAllResources`, `getAllTeachers`, `getAllTraditions` controller functions to remove server-side pagination (`skip`, `limit`).
    *   Ensure these endpoints accept an optional `?sort=key` parameter (e.g., `?sort=title_asc`) to return the full dataset sorted alphabetically by default.
*   **Frontend:**
    *   **State Management (per listing page):**
        *   `allItems`: Array holding the full, unmodified list fetched from the API.
        *   `currentSortKey`: String indicating the active sort ('alphabetical', 'random', 'author_asc', etc.).
        *   `searchTerm`: String from the search input.
        *   `displayedItems`: Array derived from `allItems` after sorting/shuffling and filtering, used for rendering.
    *   **Data Fetching:** Use `useEffect` and `fetch` (or SWR/React Query if used) to get `allItems` on component mount, requesting the default API sort.
    *   **Processing:** Use `useMemo` to efficiently calculate `displayedItems` based on changes to `allItems`, `currentSortKey`, or `searchTerm`. Implement sorting, shuffling (using a utility function), and filtering logic within this hook.
    *   **Components:**
        *   Create reusable functional components in `frontend/components/ui/`:
            *   `SortDropdown.js`: Accepts `options` array and `onChange` callback.
            *   `RandomizeButton.js`: Accepts `onClick` callback.
            *   `SearchInput.js`: Accepts `value` and `onChange` callback.
        *   Integrate these components into the relevant page files (`pages/resources/type/[type].js`, `pages/teachers/index.js`, `pages/traditions/index.js`).

**5. Implementation Plan (Phased Approach)**

*   **Phase 1: Backend API Modification**
    *   [ ] Identify relevant controller functions in `backend/controllers/`.
    *   [ ] Remove `skip()` and `limit()` calls from database queries within these functions.
    *   [ ] Add logic to accept and apply a `sort` query parameter for default alphabetical sorting (e.g., `{ title: 1 }` or `{ name: 1 }`).
    *   [ ] Test API endpoints manually (e.g., using Postman or browser) to confirm they return the full, sorted list.
*   **Phase 2: Create UI Components**
    *   [ ] Create `SortDropdown.js` with basic structure, props (`options`, `value`, `onChange`), and Tailwind styling.
    *   [ ] Create `RandomizeButton.js` with basic structure, props (`onClick`), Lucide icon, and Tailwind styling.
    *   [ ] Create `SearchInput.js` with basic structure, props (`value`, `onChange`), placeholder, Lucide icon, and Tailwind styling.
*   **Phase 3: Integrate on a Single Page (resources/type/book)**
    *   [ ] Choose `/pages/resources/type/book.js` as the pilot page.
    *   [ ] Remove existing pagination UI and logic from this page.
    *   [ ] Update data fetching logic to call the modified API (no page params, default sort).
    *   [ ] Add state management (`allItems`, `currentSortKey`, `searchTerm`, `displayedItems`).
    *   [ ] Implement the `useMemo` hook for processing (`sort`, `shuffle`, `filter`).
    *   [ ] Add the `SortDropdown`, `RandomizeButton`, and `SearchInput` components to the page layout.
    *   [ ] Connect component props (`onChange`, `onClick`, `value`) to the page's state handlers.
    *   [ ] Define sort options specifically for Books (e.g., `[{ key: 'title_asc', label: 'Title (A-Z)' }]`).
    *   [ ] Thoroughly test sorting (A-Z), randomization (multiple clicks), and search on the `/resources/type/book` page.
*   **Phase 4: Extend to Other Pages**
    *   [ ] Apply the same pattern to `/pages/traditions/index.js` (adjusting sort options/search field if needed), then to `/pages/teachers/index.js`.
    *   [ ] Apply the pattern to the other resource type pages (`/pages/resources/type/[type].js`. This might require fetching type-specific sort options or slightly adapting the logic based on the resource `type`.
    *   [ ] Test functionality on traditions and several resource type pages (e.g., books, videos).
*   **Phase 5: Final Testing & Refinement**
    *   [ ] Test across different browsers (Chrome, Firefox, Edge).
    *   [ ] Test on different screen sizes (desktop, mobile).
    *   [ ] Specifically test performance on lists with ~200+ items (if test data available). Assess scrolling smoothness and interaction delays.
    *   [ ] Refine styling as needed.
    *   [ ] Code cleanup and review.

**6. Risks & Mitigation**

*   **Risk:** Performance degradation on pages with many items (>200).
    *   **Mitigation:** Monitor during testing. If lag occurs, plan a follow-up task to implement list virtualization.
*   **Risk:** Complexity in sorting specific fields (e.g., arrays like `author`).
    *   **Mitigation:** Start with simple sorts (title, name). Address complex sorts carefully during implementation, ensuring correct array handling.
*   **Risk:** Breaking existing page functionality.
    *   **Mitigation:** Implement changes incrementally (page by page). Test thoroughly after each phase. Use version control (Git) diligently to allow rollbacks.

**7. Acceptance Criteria**

*   Sorting, Randomize, and Search controls are present and correctly styled on all scoped listing pages.
*   Default sort is alphabetical (A-Z) by title or name.
*   Sort dropdown allows selection of available sort options for that page type, and the list reorders correctly.
*   Randomize button shuffles the entire list correctly on each click.
*   Search input filters the list based on title/name as the user types.
*   Existing pagination is removed from scoped pages.
*   Functionality works correctly across major browsers and screen sizes.
*   Performance is acceptable on pages with up to ~200 items.
*   No existing site functionality is broken by these changes.
