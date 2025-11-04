# GlaWebLang Platform Design Guidelines

## Design Approach
**Reference-Based Hybrid**: Drawing inspiration from modern developer platforms (Vercel, VS Code, Replit, CodePen) combined with contemporary web app aesthetics. This creates a professional yet innovative development environment that feels both powerful and approachable.

**Core Principle**: Balance technical capability with visual excitement - creating an "epic" developer experience that doesn't sacrifice usability for aesthetics.

## Typography System

**Primary Font Stack**:
- **Interface**: Inter or IBM Plex Sans (Google Fonts) - clean, technical aesthetic
- **Code**: JetBrains Mono or Fira Code (Google Fonts) - optimized for programming
- **Accents**: Space Grotesk for headlines - adds modern energy

**Type Scale**:
- Hero Headlines: text-5xl to text-7xl, font-bold
- Section Headers: text-3xl to text-4xl, font-semibold
- Subsections: text-xl to text-2xl, font-medium
- Body Text: text-base, font-normal, leading-relaxed
- Code Text: text-sm, font-mono
- UI Labels: text-sm, font-medium
- Captions: text-xs

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistent rhythm
- Micro spacing: p-2, m-2, gap-2
- Standard spacing: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Large spacing: mt-16, mb-20

**Grid Structure**:
- Full-width app layout with fixed sidebar navigation (w-64)
- Main content area uses CSS Grid for editor/preview split
- Dashboard uses 12-column grid system (grid-cols-12)
- Tutorial sections use flexible grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

## Core Sections & Components

### 1. Landing/Marketing Page
**Hero Section** (h-screen):
- Large hero image showing the code editor interface in action (screenshot-style)
- Centered headline showcasing GWL+ uniqueness
- Dual CTAs: "Start Coding" (primary) + "View Documentation" (secondary)
- Animated code snippet preview showing GWL+ syntax
- Trust indicators: "Built for Modern Developers" badge

**Features Grid** (6 cards in 2x3 layout):
- Real-time Preview Engine
- Interactive Learning Platform
- Component-Based Architecture
- Python-Like Simplicity
- Database Integration
- One-Click Deployment

Each card: icon (Heroicons), title (text-xl), description (text-sm), subtle animation on scroll

**Syntax Showcase Section**:
- Side-by-side comparison: traditional code vs GWL+ code
- Highlights simplicity advantage
- Code blocks with syntax highlighting simulation

**Learning Path Section**:
- Horizontal timeline showing progression: Basics → Components → Advanced → Deploy
- Each step clickable with preview modal

**CTA Section**:
- Full-width, centered
- "Build Your First App in GWL+" headline
- Primary button + secondary "Explore Examples"
- Background with subtle code pattern overlay

### 2. Main Application Interface

**Top Navigation Bar** (h-16, fixed):
- Logo + "GlaWebLang" wordmark (left)
- Project name/dropdown (center-left)
- Action buttons: Save, Deploy, Share (center-right)
- User avatar + settings (right)
- Icons from Heroicons

**Left Sidebar** (w-64, fixed):
- File explorer tree
- Project sections: Files, Components, Assets, Database
- Collapsible sections with expand/collapse icons
- Bottom: Tutorials shortcut, Documentation link

**Editor Panel** (flexible width, resizable):
- Tab system for multiple files (h-12 tabs)
- Line numbers (w-12 gutter)
- Code area with monospace font
- Minimap preview (right edge, w-20)
- Status bar (bottom, h-8): language, cursor position, errors count

**Live Preview Panel** (flexible width, resizable):
- Device frame selector (mobile/tablet/desktop icons)
- Address bar simulation showing preview URL
- Iframe container for rendered output
- Refresh and fullscreen controls

**Bottom Panel** (h-48, collapsible):
- Tabs: Console, Problems, Terminal, Output
- Real-time error messages with line links
- Syntax suggestions in Spanish

### 3. Interactive Learning Section

**Tutorial Navigation** (left sidebar, w-80):
- Progress tracker showing completion %
- Categorized lessons: Fundamentals, Components, Styling, Data, Advanced
- Each lesson: number badge, title, duration estimate, completion checkmark

**Lesson Content Area**:
- Two-column layout (60/40 split):
  - Left: Lesson explanation with code examples
  - Right: Live code editor + preview (mini version)
- Step-by-step instructions with numbered badges
- "Try it yourself" interactive challenges
- "Next Lesson" button at bottom

**Challenge Cards**:
- Code challenge prompt
- Starter code template
- Expected output preview
- Hint system (expandable)
- Success/failure feedback

### 4. Documentation Panel

**Sidebar Navigation** (w-72):
- Search bar at top
- Categorized sections: Getting Started, Syntax Reference, Components, APIs, Examples
- Expandable tree structure

**Content Area**:
- Breadcrumb navigation
- Article title (text-4xl)
- Table of contents (sticky, right side on desktop)
- Code examples with copy button
- Interactive playground embeds
- "Was this helpful?" feedback at bottom

### 5. Project Dashboard

**Header Section**:
- "My Projects" headline
- Grid/List view toggle
- Sort options: Recent, Name, Modified
- "New Project" CTA button

**Project Cards Grid** (grid-cols-1 md:grid-cols-2 lg:grid-cols-3):
- Project thumbnail (aspect-video)
- Project name (text-lg, font-semibold)
- Last modified timestamp
- Quick actions: Edit, Preview, Delete
- Hover effect revealing additional info

**Template Gallery**:
- Horizontal scrollable carousel
- Pre-built templates: Landing Page, Dashboard, Blog, E-commerce
- Large preview cards with "Use Template" button

## Component Library

**Buttons**:
- Primary: Rounded (rounded-lg), medium padding (px-6 py-3), text-sm font-medium
- Secondary: Same sizing, outlined style
- Icon buttons: Square (w-10 h-10), centered icon
- All buttons: Subtle shadow, smooth transitions

**Input Fields**:
- Height: h-11
- Rounded: rounded-lg
- Padding: px-4
- Border width: border
- Label above: text-sm font-medium mb-2

**Code Blocks**:
- Background treatment with subtle pattern
- Rounded corners: rounded-xl
- Padding: p-6
- Copy button (top-right corner)
- Line numbers option
- Syntax highlighting via placeholder classes

**Cards**:
- Rounded: rounded-xl
- Padding: p-6
- Shadow: shadow-md
- Border: border
- Hover: subtle lift effect (transform translate)

**Modals**:
- Max width: max-w-2xl
- Centered overlay
- Rounded: rounded-2xl
- Padding: p-8
- Header with close button

**Tabs**:
- Horizontal pill style
- Active tab: font-semibold
- Indicator bar (bottom border)
- Spacing: gap-6

**Split Panels**:
- Draggable divider (w-1, cursor-col-resize)
- Min/max width constraints
- Smooth resize transitions

## Accessibility

- Keyboard shortcuts prominently displayed (Cmd/Ctrl + S to save, etc.)
- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- ARIA labels for icon-only buttons
- High contrast ratios throughout
- Screen reader announcements for code execution results

## Images

**Hero Image**: Large, high-quality screenshot of the GWL+ editor interface showing beautiful syntax highlighted code with the live preview panel visible. Should convey "powerful developer tool" aesthetic. Positioned as full-width background with subtle overlay for text readability.

**Feature Section Icons**: Use Heroicons CDN - code, lightning-bolt, academic-cap, puzzle-piece, database, cloud-upload

**Tutorial Thumbnails**: Simple illustrated icons representing each tutorial category - use abstract shapes and geometric patterns rather than photos

**Template Previews**: Screenshot-style images of completed projects built with GWL+ showing variety (landing pages, dashboards, etc.)

## Animation Guidelines

**Minimal, Purposeful Motion**:
- Code execution: Subtle pulse on preview panel refresh
- Success states: Checkmark fade-in with slight scale
- Panel transitions: Smooth slide (duration-300)
- NO: Constant animations, floating elements, excessive motion
- YES: State change feedback, loading indicators only

## Responsive Behavior

**Desktop (lg+)**: Full split-panel layout with all sections visible
**Tablet (md)**: Collapsible sidebars, stacked panels option
**Mobile (base)**: Single column, tabbed interface, bottom sheet panels

Critical: Editor should remain functional on all screen sizes with code formatting preserved.