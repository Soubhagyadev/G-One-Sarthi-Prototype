# G-One Sarthi — Full App Context & Documentation

## Overview

**G-One Sarthi** is an AI-powered cognitive assistance mobile app built for elderly dementia and Alzheimer's patients in the **North Eastern Region (NER) of India**, developed as a submission for **Smart India Hackathon 2026**.

The app serves two user types: **patients** (elderly individuals) and **caregivers** (family members, doctors, healthcare workers). It aims to improve cognitive well-being through memory games, voice assistance, reminders, and progress monitoring — all with culturally relevant NE Indian themes, imagery, and language support.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | React Native (Expo Go) |
| Navigation | Manual screen state (no React Navigation) |
| Fonts | Lora (serif, for headings) + Inter (available, unused) |
| Icons | SVG via `react-native-svg` + `SvgUri` |
| Notifications | `expo-notifications` (scheduled daily reminders) |
| Gradients | `expo-linear-gradient` (LoginScreen overlay) |

---

## Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| Background | `#F9F6F0` | Warm off-white, used on every screen |
| Primary Green | `#2E7359` | Buttons, nav bar, highlights |
| Ink | `#000000` | Headings, body text |
| Muted | `#786F6F` | Subtitles, secondary text |
| Card Border | `rgba(0,0,0,0.25)` | All card outlines |
| Correct | `#DDEDDD` / `#2E7359` | Game correct answer highlight |
| Incorrect | `#F8DEDE` / `#B85858` | Game wrong answer highlight |

### Typography
- **Lora-Medium** — used for almost all text (headings, labels, body, nav)
- **Lora-Bold** — used for button text and emphasis
- Large headings are 38–54px with negative letter spacing (-1.2 to -2.5) for a editorial feel

### Layout
- `SafeAreaView` wraps the whole app
- Screen horizontal padding: `27px` on the outer container
- Cards use `borderRadius: 25`, `borderWidth: 2`, `borderColor: rgba(0,0,0,0.25)`
- Bottom navigation bar: `backgroundColor: #2E7359`, `borderRadius: 50`, `height: 78`, floating above content with `bottom: 20`
- Page transitions: fade-in animation (`Animated.timing`, 260ms, cubic ease-out) on screen change

### Assets
- `fonts/Lora/` — Lora variable font (regular, medium, bold, italic variants)
- `fonts/Inter/` — Inter variable font (loaded but not actively used in components)
- `SVG_Icons/` — All UI icons as `.svg` files, loaded via `SvgUri`
- `app_image/` — All illustrative PNGs (culturally themed NE Indian illustrations)

---

## App Architecture

The app uses a **single `screen` state string** in `App.tsx` to control which component renders. There is no router or navigation library — everything is a conditional render.

### Screen State Union
```
'main' | 'name' | 'welcome' | 'login' | 'home' | 'games' | 'voice' | 'monitor'
| 'travelGame' | 'matchPairs' | 'packYourBags' | 'watchTheTray' | 'peopleFace'
```

### Navigation Flow
```
main (role selector)
├── [Patient] → name → welcome → home
│                                 ├── games
│                                 │     ├── travelGame     → games
│                                 │     ├── matchPairs     → games
│                                 │     ├── packYourBags   → games
│                                 │     ├── watchTheTray   → games
│                                 │     └── peopleFace     → games
│                                 ├── voice
│                                 └── monitor
└── [Caregiver] → login → monitor
                           ├── home
                           ├── games
                           └── voice
```

Back buttons:
- `name` → `main`
- `login` → `main`
- All game screens → `games`

---

## Screens

### 1. Main Screen (`main`)
**File:** `App.tsx` (inline)

Role selector — first screen the user sees.

- Language picker (top-right): Globe SVG + language name, opens dropdown with options: English, Hindi, Assamese, Bodo. (UI only — language switching does not yet change content)
- Title: "Welcome To G-One Sarthi"
- Subtitle: "An AI Based Companion For Elderly Patient Suffering From Dementia & Alzheimers"
- Two role cards:
  - **I'm a Patient** → navigates to `name`
  - **I'm a Caregiver** → navigates to `login`
- Each card shows a culturally themed NE Indian illustration

---

### 2. Asking For Name (`name`)
**File:** `components/AskingForName.tsx`

- "‹ Back" button → returns to `main`
- Large prompt: "What's Your Name?"
- Text input with bottom border (underline style), pre-filled with `"Amma"`
- "Proceed" button → navigates to `welcome`
- Name is stored in App state and passed to HomeScreen and WelcomeScreen

---

### 3. Welcome Screen (`welcome`)
**File:** `components/WelcomeScreen.tsx`

- Full-screen background image (NE Indian cultural illustration)
- Heading: "Welcome, [name]"
- Entire screen is a pressable — tap anywhere to continue to `home`

---

### 4. Login Screen (`login`)
**File:** `components/LoginScreen.tsx`

Caregiver-only login.

- Full-screen background image of caregivers
- Dark gradient overlay at top for heading legibility
- "‹ Back" button (white) → returns to `main`
- Heading: "Welcome Caregiver"
- Email input + Password input (secure)
- "Sign In" button
- **Credentials:** `example@new.com` / `123`
- Correct credentials → navigates to `monitor`
- Wrong credentials → Alert: "Email or password is wrong"

---

### 5. Home Screen (`home`)
**File:** `components/HomeScreen.tsx`

Main patient dashboard. Scrollable.

- Greeting: "Good Morning, Amma" *(hardcoded — name and time of day not yet dynamic)*
- Date: "Today Is Thursday 17th October" *(hardcoded — not yet using real date)*
- **Streak card** (orange): "You Have Been Playing For 0 Days" + fire icon
- **Performance card**:
  - "Memory Games 4/5 Completed" (green tile, brain icon)
  - "Daily Routine 5/6 Completed" (blue tile, water drop icon)
  - Encouragement row: smiley + "You are doing well keep it up!!"
- **Today's Game Exercise** card with green "▶ Play" button (shows Alert — not yet wired to a specific game)
- **Reminders** card: "10:00PM Take Your Meds" *(hardcoded)*
- Bottom navigation bar: Home · Games · Voice Chat · Monitor

---

### 6. Games Screen (`games`)
**File:** `components/GamesScreen.tsx`

Lists all 5 cognitive games. Scrollable.

| Game | Subtitle | Status |
|---|---|---|
| Travel Rating | Emotion recognition / social cognition | ✅ Implemented |
| Match Pairs | Helps with the memory | ✅ Implemented |
| Pack Your Bags | Pattern Recognition | ✅ Implemented |
| Watch The Tray | Memory | ✅ Implemented |
| People Face | Recognition | ✅ Implemented |

Each game is a card with an SVG icon on the left and title/subtitle on the right.

---

### 7. Voice Screen (`voice`)
**File:** `components/VoiceScreen.tsx`

- Heading: "Ask Anything"
- Large illustrated microphone image (NE Indian botanical themed)
- "Tap To Speak" button — toggles to "Listening..." state
- *(No actual speech-to-text integration — UI prototype only)*
- Bottom navigation bar

---

### 8. Monitor Screen (`monitor`)
**File:** `components/MonitorScreen.tsx`

Caregiver/patient monitoring dashboard. Scrollable. Two sections:

#### Add Reminders
- 3 default reminders: Take Medicine (8:00 PM), Drink Water (11:00 AM), Short Walk (5:00 PM)
- Each reminder card has:
  - Icon picker (tap to cycle: medicine 💊 / water 💧 / walk 🚶)
  - Editable label (TextInput)
  - Editable time (TextInput, format: `8:00 PM`)
  - "+" button → schedules a real daily push notification via `expo-notifications`
- "+ Add another reminder" button adds a new blank row
- Example hint text shown below

#### Analytics
- "Game Performance" section
- Progress bars for all 5 games (currently hardcoded at 100%)
- Controller SVG icon as section header

---

## Games

### Travel Rating (Emotion Recognition)
**File:** `components/TravelPatternGame.tsx`

- 6 rounds, one emotion per round
- Shows a face image (Happy, Sad, Worried, Surprised, Calm, Angry) — NE Indian face illustrations
- 4 multiple-choice emotion labels
- Correct → green highlight, Incorrect → red highlight
- Feedback text + "Next Person" button
- Final score out of 6
- Images from: `app_image/Games/Travel_Pattern/`

---

### Match Pairs (Memory)
**File:** `components/MatchPairsGame.tsx`

- 16-card grid (8 pairs), classic memory flip game
- Cards show "?" when face-down (green background), image when flipped
- Tap two cards: if they match → stay revealed; if not → flip back after 850ms
- Move counter
- Images: Bamboo, Basket, Bird, Boat, Flower, House, Landscape, Shawl
- Complete screen shows move count + Play Again / Back To Games
- Images from: `app_image/Games/Match_Pairs/`

---

### Pack Your Bags (Pattern Recognition / Reasoning)
**File:** `components/PackYourBagsGame.tsx`

- 6 scenarios about a character named "Maya"
- Each scenario presents a travel situation and asks what to pack
- 4 options per round (one correct)
- Correct → green, Incorrect → red, feedback text shown
- Final score: "Maya is ready to travel! You chose X helpful items out of 6."

---

### Watch The Tray (Memory)
**File:** `components/WatchTheTrayGame.tsx`

- 3 difficulty levels:
  - Easy: 3 objects, 5 seconds to memorise
  - Medium: 5 objects, 5 seconds to memorise
  - Hard: 7 objects, 4 seconds to memorise
- **Phase 1 — Memorise:** Shows tray items with animated countdown badge (pulses each second)
- **Phase 2 — Recall:** Shows tray items + equal number of distractors, all shuffled. Tap to select. Submit enables only when correct count selected.
- **Phase 3 — Result:** Score, emoji feedback, missed items (orange), wrong picks (red)
- Images: Bottle, Carpet, Cup, Jute Bag, Rice, Shawl, Spinach, Steel Tiffin, Umbrella
- Images from: `app_image/Games/Watch_Tray/`

---

### People Face (Face Recognition)
**File:** `components/PeopleFaceGame.tsx`

- 4 people: Amma, Amma's Son, Amma's Daughter, Amma's Doctor
- **Phase 1 — Study (8 seconds):** All 4 faces shown in a 2×2 grid with name badge. Animated countdown auto-advances to quiz.
- **Phase 2 — Quiz:** One face at a time (shuffled order), 4 name options. Feedback after each answer.
- **Phase 3 — Result:** 2×2 grid with green border (correct) / red border (wrong). Shows "You said: X" for wrong answers.
- Images from: `app_image/Games/People_Face/`

---

## File Structure

```
G-One-Sarthi-Prototype/
├── App.tsx                          # Root: screen state, navigation logic, main screen UI
├── app.json                         # Expo config
├── package.json
├── tsconfig.json
├── Instruction.md                   # Hackathon problem statement
│
├── components/
│   ├── AskingForName.tsx            # Patient name entry screen
│   ├── WelcomeScreen.tsx            # Animated welcome with patient name
│   ├── LoginScreen.tsx              # Caregiver login (email/password)
│   ├── HomeScreen.tsx               # Patient dashboard
│   ├── GamesScreen.tsx              # Game selection list
│   ├── VoiceScreen.tsx              # Voice assistant UI
│   ├── MonitorScreen.tsx            # Reminders + analytics
│   ├── TravelPatternGame.tsx        # Emotion recognition game
│   ├── MatchPairsGame.tsx           # Memory card flip game
│   ├── PackYourBagsGame.tsx         # Reasoning / packing game
│   ├── WatchTheTrayGame.tsx         # Tray memory game
│   └── PeopleFaceGame.tsx           # Face recognition game
│
├── app_image/
│   ├── Main_Screen/                 # Patient + Caregiver role card images
│   ├── Welcome_Screen/              # Welcome screen background
│   ├── Login_Screen/                # Caregiver login background
│   ├── Voice_Page/                  # Mic illustration
│   └── Games/
│       ├── Match_Pairs/             # 8 NE Indian themed images
│       ├── Travel_Pattern/          # 6 emotion face images
│       ├── Watch_Tray/              # 9 household object images
│       └── People_Face/             # 4 character face images
│
├── SVG_Icons/
│   ├── Globe.svg                    # Language selector icon
│   ├── Home/                        # Nav bar + home screen icons
│   ├── Games/                       # Game card icons
│   ├── Voice/                       # Mic icon
│   └── Monitor_Section/             # Reminder icons (medicine, water, walk, controller, plus)
│
└── fonts/
    ├── Lora/                        # Lora variable font + static weights
    └── Inter/                       # Inter variable font + static weights
```

---

## Known Gaps / Not Yet Implemented

| Feature | Status |
|---|---|
| Language switching (Hindi, Assamese, Bodo) | UI only — selecting a language does not change content |
| Real date/time on HomeScreen | Hardcoded ("Thursday 17th October") | ✅ Fixed — uses real date with ordinal suffix |
| Dynamic patient name on HomeScreen | Hardcoded ("Amma") — name from AskingForName not passed through | ✅ Fixed — name passed from App state |
| Voice-to-text on Voice Screen | UI toggle only — no STT integration |
| "Today's Game Exercise" Play button | Shows Alert — not wired to a specific game |
| HomeScreen reminders | Hardcoded single entry — not connected to MonitorScreen reminders |
| Analytics (game performance %) | Hardcoded at 100% — not tracking real game results |
| Caregiver dashboard | Caregivers land on MonitorScreen — no separate caregiver view |
| Offline sync | Not implemented |
| Adaptive difficulty (AI/ML) | Not implemented |

---

## Hackathon Context

**Competition:** Smart India Hackathon 2026
**Problem Domain:** Elderly healthcare, cognitive assistance, NER India
**Target Users:** Elderly dementia/Alzheimer's patients + their caregivers in rural/remote NE India
**Key Requirements from Problem Statement:**
- Adaptive cognitive games (memory, attention, pattern recognition)
- Multilingual + voice-assisted interaction
- Culturally familiar NE Indian themes and visuals
- Medicine/hydration/activity reminders
- Caregiver monitoring dashboard
- Offline functionality
- Simple, elderly-friendly UI/UX
