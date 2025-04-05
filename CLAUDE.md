# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# PaceWise Landing Page - Claude Guide

## Project Structure
- Landing page for iOS running calculator app
- Plain HTML/CSS/JS static site
- GitHub Pages deployed with custom domain (pacewise.app)

## Commands
- No build process or package manager
- Simply edit files and push to GitHub for deployment
- Test locally by opening index.html in browser

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements (header, main, section, footer)
- 4-space indentation
- BEM-style class naming: `block__element--modifier`
- Include proper ARIA attributes for accessibility

### CSS
- Mobile-first approach with media queries for larger screens
- Use CSS variables for theming and consistent spacing
- Dark mode support via data-theme attributes
- Organize by component with section comments

### JavaScript
- Functional programming style with descriptive names
- Error handling for asynchronous operations
- 4-space indentation
- Support for both mouse and keyboard navigation
- System preference detection for dark/light mode
- Comment functions with brief descriptions

### Images
- Optimize images for both themes (separate dark/light versions)
- Use data-dark-src attribute for theme-specific images
- Use webp format for better performance

### Accessibility
- Include proper focus states and keyboard navigation
- Respect prefers-reduced-motion system preference
- Maintain appropriate color contrast in both themes