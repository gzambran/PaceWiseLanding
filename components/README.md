# PaceWise Shared Components

This directory contains shared components for the PaceWise landing page. This uses a simple HTML injection approach that doesn't require any build tools.

## How It Works

1. The `shared-components.js` file contains functions that:  
   - Generate HTML for the header and footer
   - Insert the HTML into the page when it loads
   - Handle theme switching functionality

2. You include the components on a page by:  
   - Adding a script tag to load the shared components
   - Adding `<site-header></site-header>` and `<site-footer></site-footer>` tags where you want the components to appear

## Implementation Details

This approach uses plain JavaScript and doesn't require any framework or build step. It works by:

1. Replacing the placeholder tags with actual HTML content
2. Initializing any required functionality (like theme toggling)
3. Maintaining consistent appearance across pages

## How to Use

1. Include the shared components script in your HTML:
   ```html
   <script src="components/shared-components.js"></script>
   ```

2. Add the component placeholders to your page:
   ```html
   <site-header></site-header>
   <!-- Your page content here -->
   <site-footer></site-footer>
   ```

## How Theme Toggle Works

The theme toggle functionality:

1. Reads/writes theme preference to localStorage
2. Detects system color scheme preference
3. Updates the DOM with the correct theme
4. Handles image swapping for dark/light mode

## Benefits of This Approach

- **Simplicity**: No build tools or complex frameworks required
- **Consistency**: Header and footer are identical across all pages
- **Maintainability**: Updates only need to be made in one place
- **Performance**: Fast loading with minimal dependencies
