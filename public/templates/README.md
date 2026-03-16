# SVG Template Naming Convention for Illustrator

## File naming
templates/{family-id}/{sign-type-id}.svg
Example: templates/metro/room_id.svg

## Required Layer Names (Illustrator layers become SVG element IDs)

### Color Zones (groups containing shapes)
- face-fill          - Receives faceColor token
- raised-text        - Receives raisedTextColor token
- accent-bar         - Receives accentColor token
- insert-background  - Receives insertBgColor token
- insert-text        - Receives insertTextColor token
- backer             - Receives backer/shadow color

### Text Zones (groups where app injects dynamic text)
- text-primary       - Primary text / room name
- text-secondary     - Secondary line (department, etc.)
- text-room-number   - Room number
- text-braille       - Braille zone (app generates braille dots)

### Pictogram Zone
- pictogram-slot     - App injects pictogram SVGs here

## Export Settings (Illustrator - Save As SVG)
- SVG Profiles: SVG 1.1
- Type: Convert to Outline (IMPORTANT - all text as paths)
- Image Location: Embed
- CSS Properties: Presentation Attributes
- Decimal Places: 2
- Check "Responsive" (no width/height, viewBox only)
- Uncheck "Minify"

## Tips
- Keep layer structure flat - deeply nested groups add complexity
- Use unique fill colors for each zone in AI so they are easy to find
- The face-fill layer should contain the main background shape
- Accent bars, dividers, and decorative elements go in accent-bar
- Insert panels (e.g., the room number window) go in insert-background
