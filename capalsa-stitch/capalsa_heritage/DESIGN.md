# Design System Specification: The Curated Home

## 1. Overview & Creative North Star: "The Digital Curator"

This design system moves beyond the rigid, sterile grids of traditional big-box e-commerce. While the foundation is built on the reliability and scale of "Walmart-style" retail, the execution is elevated through **The Digital Curator**—a creative north star that treats every product listing as an editorial feature and every category as a curated room.

We break the "template" look by utilizing intentional asymmetry, layered depth, and a high-contrast typography scale. By balancing the established authority of Deep Blue with the organic warmth of Soft Sage, we create a space that feels both "established for 10 years" and "modern for tomorrow."

**The Signature Move:** We replace traditional structural lines with tonal shifts. The interface should feel like high-end stationery or layered architectural materials—tactile, soft, and premium.

---

## 2. Colors: Tonal Depth & Soul

Our palette is anchored in trust but expressed through warmth. We avoid the "harshness" of pure digital black and standard retail greys.

### The Palette (Material Design Tokens)
*   **Primary Palette:** `primary` (#00386c) and `primary_container` (#1a4f8b). Use these to anchor the brand’s 10-year heritage.
*   **Secondary (Trust & Freshness):** `secondary` (#43673c) and `secondary_container` (#c1ebb5). These Sage tones are for sustainability markers, organic product lines, and "Trust" badges.
*   **Tertiary (The Functional Glow):** `tertiary` (#582d00) and `tertiary_container` (#794000). Use these warm, clay-like oranges for CTAs to drive conversion without looking "cheap."
*   **Neutral Surfaces:** `surface` (#fbf9f8) and `surface_container_low` (#f5f3f3).

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Boundaries must be defined solely through background color shifts. To separate the header from the hero, or the product description from the reviews, use a shift from `surface` to `surface_container_low`. This creates a seamless, high-end editorial feel.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `surface`
*   **Structural Sections:** `surface_container_low`
*   **Interactive Cards:** `surface_container_lowest` (Pure White)
*   **Floating Elements:** `surface_bright` with Glassmorphism.

### The "Glass & Gradient" Rule
To prevent a "flat" retail feel, main CTAs and Hero backgrounds should utilize a subtle linear gradient from `primary` to `primary_container` (155-degree angle). For floating navigation or "Quick View" modals, use a backdrop-blur (12px to 20px) on a semi-transparent `surface` color to mimic frosted glass.

---

## 3. Typography: Editorial Authority

We use a dual-typeface system to balance modern efficiency with premium character.

*   **Display & Headlines (Plus Jakarta Sans):** This is our "Editorial" voice. It is sophisticated, with slightly tighter tracking and wider apertures.
    *   `display-lg`: 3.5rem — For major seasonal campaigns.
    *   `headline-md`: 1.75rem — For product categories and section headers.
*   **Body & UI (Inter):** Our "Utility" voice. Chosen for its extreme legibility at small sizes and high x-height.
    *   `body-lg`: 1rem — Default paragraph text.
    *   `label-md`: 0.75rem — For technical specs and micro-copy.

**Hierarchy Note:** Use `title-lg` (Inter) for product names to maintain a "familiar" e-commerce feel, but keep `headline-sm` (Plus Jakarta Sans) for "Why Shop With Us" sections to reinforce the premium brand.

---

## 4. Elevation & Depth: Tonal Layering

We reject traditional box-shadows. Depth is a result of light and material, not "ink."

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. The slight shift in "warmth" creates a natural lift that feels like layered cardstock.
*   **Ambient Shadows:** If a floating effect is required (e.g., a "Add to Cart" sticky mobile bar), use a shadow tinted with `on_surface` at 4% opacity with a 32px blur. It should feel like a soft glow, not a hard edge.
*   **The "Ghost Border":** If a border is required for accessibility on inputs, use `outline_variant` at 20% opacity. 
*   **Glassmorphism:** For high-end product overlays, use `surface_variant` at 70% opacity with a `blur(16px)`. This integrates the UI into the high-quality product imagery.

---

## 5. Components: The Premium Primitives

### Buttons: The "Signature" Action
*   **Primary:** Gradient from `primary` to `primary_container`. `Rounded-lg` (1rem). High-contrast `on_primary` text.
*   **Secondary:** `surface_container_highest` background with `on_surface` text. No border.
*   **Tertiary (CTA):** `tertiary_container` background. Use sparingly for "Buy Now" or "Limited Offer."

### Cards: The Product Frame
*   **Visuals:** Forbid divider lines. Use `surface_container_lowest` for the card body. 
*   **Imagery:** Product images should have a `rounded-md` (0.75rem) corner and be set against a very subtle `surface_container_low` background within the card to ensure white products don't "disappear."
*   **Spacing:** Use 24px (1.5rem) internal padding to provide "luxury" breathing room.

### Input Fields: The Soft Form
*   **State:** Background `surface_container_low`, `rounded-md`. 
*   **Active:** Shift background to `surface_container_lowest` and add a 1px "Ghost Border" using `primary` at 30% opacity.

### Trust Badges: The "Established" Marker
*   **Style:** Use `secondary_container` (Sage Green) for background. Pair with `on_secondary_container` (Deep Green) for icons. This conveys "10 years of experience" through a "fresh" yet "grounded" lens.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetric Grids:** In hero sections, let the product image bleed off the edge of the container to create a sense of scale.
*   **Embrace White Space:** Treat white space as a luxury material. If a section feels "busy," increase the vertical spacing using the `xl` (1.5rem) scale.
*   **Focus on Imagery:** Only use high-resolution, lifestyle photography. The UI is the "gallery wall," the product is the "art."

### Don't:
*   **Don't use 100% Black:** Always use `on_surface` (#1b1c1c) for text to maintain the "Warm Home" feel.
*   **Don't use hard borders:** Never use a 1px solid line to separate the header, footer, or cards. Use background color shifts.
*   **Don't use "Standard" Blue:** Avoid "Hyperlink Blue." Stick strictly to the `primary` Deep Blue to maintain the premium, established tone.
*   **Don't crowd the CTAs:** Give the "Add to Cart" button at least 16px of clear space on all sides. Premium retail never feels "crowded."