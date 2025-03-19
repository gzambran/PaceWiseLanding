# PaceWise Website

This is the landing page website for PaceWise, a running calculator app for iOS.

## Setup for GitHub Pages

1. Create a new repository on GitHub named `pacewise-website` or `pacewise.github.io`
2. Push these files to your repository
3. Go to Settings > Pages
4. Under "Source", select "main" branch
5. Click Save
6. Configure your custom domain (pacewise.app)

## Custom Domain Setup

To set up your custom domain:

1. Add a file named `CNAME` in the repository with your domain
2. Configure your DNS provider with the following records:
   - A record pointing to GitHub Pages IP addresses:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - CNAME record from www to your username.github.io

## Adding App Screenshots

The landing page has a placeholder for app screenshots in a phone mockup. To add real screenshots:

1. Take screenshots of your app in action (ideally showing the main calculator interface)
2. Size the screenshots to 260px wide by 540px tall for best fit
3. Replace the placeholder phone-screen content in index.html with your screenshot:

```html
<div class="phone-screen">
  <img src="app-screenshot.png" alt="PaceWise App in action">
</div>
```

## Color Scheme

The color scheme has been updated to match your app:
- Primary: #4C7CFF (Blue)
- Secondary: #5B5E6B (Gray)
- Background (light): #F5F7FA
- Dark UI: #1E1F23
