Securin Assessment

This repository contains the solution to the Securin Assessment problem. It implements a paginated table with a dropdown to control the number of rows displayed, page navigation (including carousel-like pagination for page numbers), and dynamic fetching of data from an API.

**Table of Contents**

**Logical Approach**

**Quality of Code**

**Features**

**Input and Output Screenshots**

**Overall Approach**

**Setup Instructions**

**Logical Approach**

Problem Statement:

Display a table populated with data fetched from an API.

Include a dropdown to control the number of rows displayed.

Add pagination with a carousel-like display of page numbers.

Allow dynamic navigation between pages and rows.

Logic Implementation:

Fetching Data:
The data is fetched from the API using Axios in a React useEffect hook.

Filtering Data for Pages:
The rows displayed on the table are dynamically updated based on the current page and the value of rows per page selected from the dropdown.

Pagination Logic:
Pagination tracks the current page, total pages, and the window of page numbers visible (e.g., only 5 at a time).

Carousel-like Pagination:
A sliding window logic ensures only a limited number of page numbers (5) are visible at a time. Buttons for navigation (First, Prev, Next, Last) allow seamless traversal.

**Quality of Code**

Modular Design:

Functions and hooks are cleanly separated.

Variables and state hooks have descriptive names.

The UI is dynamically updated based on state changes.

Responsive Design:

Dropdown and pagination are styled to fit comfortably in the UI.

The layout adapts to screen sizes.

Error Handling:

Added a try-catch block for API calls to handle errors gracefully.

Conditional rendering ensures fallback messages (e.g., "Loading...", "No CVEs found") when data is unavailable or still being fetched.

Performance Optimization:

Only the visible rows for the current page are rendered.

The pagination logic minimizes unnecessary re-renders.

Features

Dynamic Row Display:

Dropdown to control the number of rows displayed (10, 50, 100).

Pagination:

Carousel-like pagination for large datasets.

Navigation buttons for First, Prev, Next, and Last pages.

Interactive Table:

Clickable rows to navigate to detailed information.

Proper formatting of date fields for readability.

Input and Output Screenshots

**Input**

Dropdown to select number of rows per page:


Pagination with carousel:


Output

Table displaying rows and paginated controls:
![Alt text](outputs/img1.png)
![Alt text](outputs/img2.png)
![Alt text](outputs/img3.png)
![Alt text](outputs/img4.png)
![Alt text](outputs/img5.png)
Overall Approach

Frontend Development:

Built the UI using React.

Styled components using CSS for simplicity.

Data Handling:

Used Axios to fetch data from the API.

Dynamically sliced the data array to display only the required rows per page.

Pagination Design:

Implemented a sliding window for page numbers.

Updated the current page dynamically based on user interaction.

User Experience:

Dropdown above the table for controlling rows.

Smooth transitions between pages with carousel-like navigation.
