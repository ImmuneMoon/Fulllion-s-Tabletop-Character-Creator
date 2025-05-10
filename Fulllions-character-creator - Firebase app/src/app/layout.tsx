@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: Arial, Helvetica, sans-serif;
}

@layer base {
  :root {
    --background: 0 0% 7%; /* #121212 */
    --foreground: 0 0% 98%; /* Light text for dark background */

    --card: 0 0% 10%; /* Slightly lighter than background for cards */
    --card-foreground: 0 0% 95%;

    --popover: 0 0% 10%;
    --popover-foreground: 0 0% 95%;

    --primary: 180 100% 25.1%; /* Teal #008080 */
    --primary-foreground: 0 0% 98%; /* White/Light gray text on teal */

    --secondary: 0 0% 14.9%; /* Based on existing dark theme values */
    --secondary-foreground: 0 0% 98%;

    --muted: 0 0% 14.9%; /* Based on existing dark theme values */
    --muted-foreground: 0 0% 63.9%;

    --accent: 180 90% 35%; /* Lighter/brighter Teal for accent */
    --accent-foreground: 0 0% 98%;

    --destructive: 0 62.8% 30.6%; /* Based on existing dark theme values */
    --destructive-foreground: 0 0% 98%;

    --border: 0 0% 20%; /* Border for elements */
    --input: 0 0% 15%; /* Input background (if not transparent, e.g., for standalone inputs) */
    --ring: 180 100% 30%; /* Teal based for focus rings */
    
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --radius: 0.5rem;

    /* Sidebar variables from existing theme, can be kept or adjusted if sidebar is used */
    --sidebar-background: 0 0% 10%; /* Example: Match popover background */
    --sidebar-foreground: 0 0% 95%;
    --sidebar-primary: 180 100% 25.1%; /* Teal */
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 180 90% 35%; /* Lighter Teal */
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 0 0% 20%;
    --sidebar-ring: 180 100% 30%;
  }
  /* Removed .dark block as dark theme is now default in :root */
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

#currHP {
  height: 3.5em;
}
