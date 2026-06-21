Recreate two pixel-accurate desktop music app screens from the same product: HOME and ARTISTS.

Global design system:
- Frame size for each screen: 1280 x 1024 px.
- Create two separate frames named “HOME” and “ARTISTS”.
- Brand: LYRICA.
- Style: dark premium music dashboard, glass panels, subtle borders, lime accent.
- Background: #0f0f10.
- Accent color: #e2fb5e.
- Font: Inter.
- Use uppercase bold/black headings with slight letter spacing.
- Use muted text #78716c and dim text rgba(255,255,255,0.6).
- Shared components across both pages:
  - Left sidebar: x=0, y=0, width=260, height=1024.
  - Bottom player: x=0, y=916 or 917, width=1280, height=108.
  - Top action cluster: notification, settings, avatar.
  - Same dark glass styling, subtle blur, thin borders.

PAGE 1: HOME

Layout:
- Left sidebar:
  - Width 260, full height.
  - Background rgba(20,20,20,0.85).
  - Padding 24 horizontal, 32 top.
  - Logo text “LYRICA”, white, 27px, black weight, letter spacing 2px.
  - Subtitle “LYRICS MUSIC LIFE”, 10px, muted gray.
  - Nav items: HOME, LIBRARY, ARTISTS, ALBUMS, RADIO.
  - HOME is active: lime icon/text and rgba(255,255,255,0.06) rounded pill.
  - Add “MY MUSIC”, “+ CREATE PLAYLIST”, Daily Mix 1, Liked Songs.

- Top bar:
  - x=260, y=0, width=1020, height about 97.
  - Search pill at x≈319, y=24, width≈457, height≈54.
  - Placeholder: “Search for tracks, artists...”
  - Right icons and circular avatar at top right.

- Main center:
  - x=274, y=97, width=670, height=921.
  - Inner padding 32.
  - Subtle left/right vertical borders.
  - Hero card: width 602, height 320, rounded 20.
  - Hero image: dark blue/black spotlight concert-like background.
  - Bottom dark gradient overlay.
  - Badge: “FEATURED RELEASE”, lime background.
  - Title: “BLINDING LIGHT”, white, uppercase, 51px, black weight.
  - Description: “Experience the heavy synth-wave atmosphere of the latest chart-topping masterpiece from the Digital Lab.”
  - Buttons: lime “Play Now” pill, glass “Add to Library” pill.

- Popular Artists:
  - Header: “POPULAR ARTISTS”, right link “SEE ALL”.
  - Five circular 80px avatars:
    - The Creator
    - 21 Savage
    - Travis Scott
    - Drake
    - SZA

- Recently Played:
  - Header: “RECENTLY PLAYED”.
  - Three rows, each 60px high:
    - 01 Moonlight / Kali Uchis / Red Moon In Venus / 3:34
    - 02 Starboy / The Weeknd / Starboy / 3:34
    - 03 Lava Lamp / Thundercat / Drunk / 3:34
  - Each row has number, 40px album art, title/artist, album name, duration, heart, three dots.

- Right now-playing panel:
  - x=958, y=97, width=309, height=923.
  - Header “NOW PLAYING”.
  - Large cover 245 x 255, rounded 16, snowy mountain image.
  - Title “Snowfall”, artist “Oneheart”.
  - Queue section:
    - “NEXT IN QUEUE” and lime “SHOW ALL”.
    - Night Drive / Oneheart, Reidenshi.
    - Apathy / Oneheart, dimmed.

- Footer player:
  - Dark glass bar, height 108.
  - Left: small cover, “SNOWFALL”, “Oneheart”.
  - Center: shuffle, previous, lime circular pause button, next, repeat.
  - Progress: 1:45 to 3:20, lime progress about 45%.
  - Right: heart, queue, lyrics/mic, volume icon, volume bar.

PAGE 2: ARTISTS

Use the same sidebar and footer player from HOME.

Layout:
- Frame name: “ARTISTS”.
- Background: #0f0f10.
- Main content area starts after sidebar:
  - x=260, y=0, width=1020, height=1024.

- Header/top navigation:
  - At x=292, y=32, width≈956, height≈64.
  - Small home icon at left.
  - Search pill at x≈341, y≈34, width≈384, height≈60.
  - Placeholder: “Search for music...”
  - Right action cluster at x≈1071, y≈40 with ticket, notification with lime dot, settings, circular avatar.

- Profile Hero Section, bento style:
  - x=292, y=144, width=956, height=340.
  - Two-card layout:
    - Large left hero card: width≈629, height=340, rounded.
    - Right stats card: width≈303, height≈303, aligned top-right.

- Large left hero card:
  - Use a moody artist/banner image background.
  - Add dark gradient overlay.
  - At lower area, place a 128 x 128 square/circular profile image with border/shadow.
  - To the right of profile image, add large artist/profile title text.
  - Use title like “YOUR MUSIC PROFILE” or “The Creator” if exact text is unavailable.
  - Under it, add three stats:
    - “128 Playlists”
    - “2.4k Followers”
    - “582 Following”
  - Text should be white/muted, matching the dark premium style.

- Right stats card:
  - Dark bento card, rounded, subtle border.
  - Small muted label at top.
  - Large heading: “Listening Streak: 14 Days”.
  - Below, add two stat rows with horizontal dividers:
    - “Hours listened” with value around “49.2”
    - “New artists” with value around “12”
  - Use large white numbers and muted labels.

- Top Artists section:
  - x=292, y=532, width=956, height≈247.
  - Header: “TOP ARTISTS”.
  - Right link: “VIEW ALL”.
  - Six artist cards in a horizontal row.
  - Each artist image: 139 x 139, rounded or circular depending on image style.
  - Cards spaced about 24px apart.
  - Each card has artist name below and a small muted subtitle like monthly listeners or genre.
  - Suggested names:
    - Drake
    - The Weeknd
    - Travis Scott
    - SZA
    - Kendrick
    - Billie Eilish
  - Keep typography compact: name white 14px bold, subtitle muted 11px.

- Bottom footer player:
  - Same as HOME, x=0, y=916, width=1280, height=108.
  - Maintain consistent controls and track info.

Important accuracy instructions:
- Do not create a landing page.
- Do not add extra marketing sections.
- Keep both pages as app/dashboard screens.
- Use the exact 1280 x 1024 desktop frame.
- Keep HOME and ARTISTS visually consistent.
- Match spacing closely: sidebar 260px, main content begins at x=260, bottom player overlays the bottom.
- Use dark glass surfaces, lime accent only for active states and play controls.
- Avoid bright gradients except image overlays.
- Keep all text and controls inside the frame.