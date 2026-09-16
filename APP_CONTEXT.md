# G-One Sarthi — Full App Context & Documentation

## Overview

**G-One Sarthi** is an AI-powered cognitive assistance mobile app built for elderly dementia and Alzheimer's patients in the **North Eastern Region (NER) of India**, developed as a submission for **Smart India Hackathon 2026**.

The app serves two user types: **patients** (elderly individuals) and **caregivers** (family members, doctors, healthcare workers). It aims to improve cognitive well-being through memory games, voice assistance, reminders, and progress monitoring — all with culturally relevant NE Indian themes, imagery, and language support.

---

## Package Versions

| Package | Version | Purpose |
|---|---|---|
| `expo` | `~54.0.0` | Core Expo SDK |
| `react` | `19.1.0` | React runtime |
| `react-native` | `0.81.5` | React Native framework |
| `typescript` | `~5.9.0` | Language |
| `expo-font` | `~14.0.0` | Custom font loading (Lora) |
| `expo-status-bar` | `~3.0.0` | Status bar control |
| `expo-constants` | `~18.0.14` | App config + extra (Gemini key) |
| `expo-linear-gradient` | `~15.0.0` | Login screen gradient overlay |
| `expo-notifications` | `~0.32.0` | Daily reminder push notifications |
| `expo-speech` | `~14.0.8` | Text-to-speech (voice assistant read aloud) |
| `expo-speech-recognition` | `3.1.3` | Speech-to-text (voice input) — must stay 3.x for SDK 54 |
| `@react-native-async-storage/async-storage` | `2.2.0` | Persistent local storage |
| `@react-native-community/datetimepicker` | `8.4.4` | Native time picker for reminders |
| `react-native-svg` | `15.12.1` | SVG icon rendering |
| `react-native-svg-transformer` | `^1.5.3` | Import `.svg` files as React components |
| `@types/react` | `~19.1.0` | TypeScript types for React |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | React Native with Expo SDK 54 |
| Navigation | Manual screen state in App.tsx (no React Navigation) |
| Storage | AsyncStorage for streak, history, reminders, caregiver notes |
| Fonts | Lora Medium and Bold |
| Icons | SVG via `react-native-svg` |
| Time Picker | `@react-native-community/datetimepicker` |
| Notifications | `expo-notifications` (scheduled daily reminders) |
| Voice AI | Gemini API via `expo-speech` (TTS) + `expo-speech-recognition` (STT) |
| Gradients | `expo-linear-gradient` (LoginScreen overlay) |
| Build | EAS Build (cloud) — outputs APK via `preview` profile |

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
| SOS Red | `#B85858` | Emergency SOS button, incorrect game answers |
| Correct Green | `#DDEDDD` / `#2E7359` | Game correct answer highlight |
| Easy Badge | `#4A9E6B` | Easy difficulty badge on games |
| Medium Badge | `#C47A2B` | Medium difficulty badge on games |
| Hard Badge | `#B85858` | Hard difficulty badge on games |

### Typography
- **Lora-Medium** — used for almost all text (headings, labels, body, nav)
- **Lora-Bold** — used for button text and emphasis
- Large headings are 38–54px with negative letter spacing (-1.2 to -2.5) for an editorial feel

### Layout
- `SafeAreaView` wraps the whole app
- Screen horizontal padding: `27px` on the outer container
- Cards use `borderRadius: 25`, `borderWidth: 2`, `borderColor: rgba(0,0,0,0.25)`
- Bottom navigation bar: `backgroundColor: #2E7359`, `borderRadius: 50`, `height: 78`, floating with `bottom: 20`
- Page transitions: fade + slide-up animation (`Animated.timing`, 280ms, cubic ease-out) on every screen change
- App runs in **fullscreen immersive mode** — both status bar and navigation bar hidden (`androidStatusBar.hidden: true`)

### Assets
- `fonts/Lora/` — Lora variable font (regular, medium, bold, italic variants)
- `SVG_Icons/` — All UI icons as `.svg` files
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

### Persistent State (AsyncStorage keys)
| Key | Value | Description |
|---|---|---|
| `streakCount` | number string | Current day streak |
| `streakLastDate` | `YYYY-MM-DD` | Date streak was last updated |
| `gamesCompletedDate` | `YYYY-MM-DD` | Date games list is valid for |
| `gamesCompletedList` | JSON array | Game IDs completed today |
| `dismissedRemindersDate` | `YYYY-MM-DD` | Date dismissed list is valid for |
| `dismissedRemindersList` | JSON array | Reminder IDs dismissed today |
| `lastActive` | string | Human-readable last active time |
| `weeklyHistory` | JSON object | `{ "YYYY-MM-DD": count }` map |
| `caregiverNotes_YYYY-MM-DD` | string | Caregiver note for that date |

---

## Screens

### 1. Main Screen (`main`)
**File:** `App.tsx` (inline)

Role selector — first screen the user sees.

- Language picker (top-right): Globe SVG + language name, opens dropdown: English, Hindi, Assamese, Bodo *(UI only — does not yet change content)*
- Title: "Welcome To G-One Sarthi"
- Two role cards: **I'm a Patient** → `name`, **I'm a Caregiver** → `login`

---

### 2. Asking For Name (`name`)
**File:** `components/AskingForName.tsx`

- Back button → `main`
- Large prompt: "What's Your Name?"
- Text input pre-filled with `"Amma"`
- "Proceed" → `welcome`
- Name stored in App state, passed to HomeScreen and VoiceScreen

---

### 3. Welcome Screen (`welcome`)
**File:** `components/WelcomeScreen.tsx`

- Full-screen NE Indian cultural illustration
- Heading: "Welcome, [name]"
- Tap anywhere → `home`

---

### 4. Login Screen (`login`)
**File:** `components/LoginScreen.tsx`

- Dark gradient overlay on background image
- Email + Password inputs
- Credentials: `example@new.com` / `123` → `monitor`
- Wrong credentials → Alert

---

### 5. Home Screen (`home`)
**File:** `components/HomeScreen.tsx`

Main patient dashboard. Scrollable.

**Dynamic data:**
- Greeting: time-of-day aware ("Good Morning / Afternoon / Evening / Night, [name]")
- Date: real date with ordinal suffix ("Today Is Wednesday 16th September")
- Streak counter from AsyncStorage
- Games completed count (live from `gamesCompleted` Set)
- Reminders set/total (live from `reminders` + `dismissedReminders`)
- Next upcoming reminder with dismiss checkmark

**Cards (top to bottom):**
1. **Streak card** (orange) — fire icon + "You Have Been Playing For X Days"
2. **Performance card** — two tiles side by side:
   - Memory Games (X/5 Completed) — green tile
   - Reminders Set (X/Y or "None") — blue tile
   - Encouragement row: smiley + "You are doing well keep it up!!"
3. **Today's Game Exercise** — "▶ Play" button launches a random game
4. **Reminders** — shows next upcoming reminder with dismiss checkbox; "No upcoming reminders for today." when empty
5. **Daily Quote Card** (tappable) — rotating NE India motivational quotes in original script with English translation + language badge. Tap triggers a Y-axis flip animation to the next quote. Shows "Tap for another quote ↻" hint.
6. **Emergency SOS Button** (red) — "Emergency SOS / Tap to call for help immediately". Confirms via Alert then dials caregiver number (default: `112` India emergency). Accepts `caregiverPhone` prop for custom number.

**Bottom nav:** Home · Games · Voice Chat · Monitor

---

### 6. Games Screen (`games`)
**File:** `components/GamesScreen.tsx`

Lists all 5 cognitive games with difficulty badges.

| Game | Cognitive Domain | Difficulty | Badge Color |
|---|---|---|---|
| Travel Rating | Emotion recognition / social cognition | Easy | Green ★☆☆ |
| Match Pairs | Memory | Medium | Orange ★★☆ |
| Pack Your Bags | Pattern recognition / reasoning | Medium | Orange ★★☆ |
| Watch The Tray | Memory | Hard | Red ★★★ |
| People Face | Face recognition | Hard | Red ★★★ |

Each game card: SVG icon (left) + title, subtitle, difficulty badge (right). Card height: 120.

---

### 7. Voice Screen (`voice`)
**File:** `components/VoiceScreen.tsx`

AI-powered voice and text assistant using Gemini API.

**Features:**
- **Mic button** — tap to start speech recognition (pulses while listening)
- **Text input** — type a question directly
- **Gemini AI responses** — answers questions about streak, games, reminders using live app context
- **Reminder creation via voice** — say "remind me to take medicine at 9 PM" → Gemini returns `REMINDER:{...}` JSON → new reminder added automatically
- **Read Aloud** — responses can be spoken via `expo-speech` (en-IN, 0.85x rate)
- **Reminder set toast** — when Gemini adds a reminder, a green slide-up toast card appears from the bottom showing the emoji icon (💊/💧/🚶), label, time, and a ✓ checkmark. Auto-dismisses after 3.5 seconds.
- **Expo Go fallback** — `expo-speech-recognition` is lazy-loaded via `try/catch require()`. If the native module is unavailable (Expo Go), `sttAvailable = false` and a "Coming Soon" card is shown instead. The mic button is hidden. Text input and Gemini still work.

**Gemini system prompt context includes:**
- Patient name, day streak, games completed today, reminder status
- Instructions to respond in 2-3 short simple sentences for elderly users
- Special `REMINDER:` JSON format for setting reminders

**API:** `gemini-3.5-flash` via REST. Key read from `Constants.expoConfig.extra.geminiApiKey` (set as EAS secret `GEMINI_API_KEY`).

---

### 8. Monitor Screen (`monitor`)
**File:** `components/MonitorScreen.tsx`

Caregiver/patient monitoring dashboard. Scrollable. Two sections.

#### Add Reminders
- 3 default reminders: Take Medicine (8:00 PM), Drink Water (11:00 AM), Short Walk (5:00 PM)
- Each reminder row: icon picker modal → label TextInput → time picker (native `DateTimePicker`) → save (✚) button → delete (✕) button
- **Save button** schedules a real **daily repeating push notification** via `expo-notifications` DAILY trigger at the reminder's time. Cancels any previous notification for that reminder ID first.
- **Delete button** cancels the scheduled notification for that reminder.
- "+ Add another reminder" adds a new blank row

#### Analytics
1. **Today's Summary** — Games Played (X/5), Day Streak, Reminders Done (X/Y) in coloured circles
2. **Last Active** — green card showing when the patient last opened the app
3. **Reminders Today** — fraction + progress bar
4. **7-Day Activity** — bar chart showing games played per day (today highlighted in dark green)
5. **Game Performance** — per-game progress bars (✓ or —)
6. **Caregiver Notes** — multiline TextInput for daily observations. Saved to AsyncStorage keyed by today's date (`caregiverNotes_YYYY-MM-DD`). Save button turns green with "✓ Saved" for 2 seconds on save.

---

## Games

### Travel Rating (Emotion Recognition)
**File:** `components/TravelPatternGame.tsx`

- 6 rounds. Shows NE Indian face illustration + 4 emotion label choices.
- Emotions: Happy, Sad, Worried, Surprised, Calm, Angry
- Correct → green highlight. Incorrect → red.
- Final score out of 6.

---

### Match Pairs (Memory)
**File:** `components/MatchPairsGame.tsx`

- 16-card grid (8 pairs). Classic memory flip game.
- Face-down: green "?" card. Flip two → match stays revealed, no-match flips back after 850ms.
- Move counter. Complete screen: move count + Play Again / Back.
- Images: Bamboo, Basket, Bird, Boat, Flower, House, Landscape, Shawl

---

### Pack Your Bags (Reasoning)
**File:** `components/PackYourBagsGame.tsx`

- 6 scenarios about "Maya" going on a trip.
- Choose the correct item to pack from 4 options.
- Final: "Maya is ready to travel! You chose X helpful items out of 6."

---

### Watch The Tray (Memory)
**File:** `components/WatchTheTrayGame.tsx`

3 difficulty levels:

| Difficulty | Objects | Time |
|---|---|---|
| Easy | 3 | 5 seconds |
| Medium | 5 | 5 seconds |
| Hard | 7 | 4 seconds |

- Phase 1: Memorise tray items (animated countdown)
- Phase 2: Recall — select correct items from shuffled grid (includes distractors)
- Phase 3: Result — missed items (orange), wrong picks (red)

---

### People Face (Face Recognition)
**File:** `components/PeopleFaceGame.tsx`

- 4 people: Amma, Amma's Son, Amma's Daughter, Amma's Doctor
- Phase 1 (8s): Study 2×2 grid with name badges. Auto-advances.
- Phase 2: One face at a time, 4 name options.
- Phase 3: 2×2 result grid with green/red borders.

---

## Notifications

Push notifications are configured via `expo-notifications`.

- **Foreground handler** set in `App.tsx` — notifications show as alerts even when app is open (`shouldShowAlert: true`, `shouldPlaySound: true`)
- **Scheduling** — in `MonitorScreen.saveReminder()`: requests permissions, then calls `Notifications.scheduleNotificationAsync()` with a `DAILY` trigger at the reminder's hour/minute. If the time has already passed today, schedules for tomorrow.
- **Cancellation** — `deleteReminder()` calls `Notifications.cancelScheduledNotificationAsync(id)`
- **Notification identifier** = reminder `id` (used for cancellation)
- **Content**: title = `{emoji} {label}`, body = `"It's time! {label} — {time}"`
- **app.config.js plugin**: `expo-notifications` with `color: '#2E7359'`

---

## NE India Motivational Quotes

8 genuine quotes in Assamese and Meitei (Manipuri), each shown with:
- Original script text
- English translation
- Language badge (e.g. "Assamese", "Meitei (Manipuri)")

| # | Language | Theme |
|---|---|---|
| 1 | Assamese | Life as a journey, new beginnings |
| 2 | Assamese | Self-worth and identity |
| 3 | Assamese | Patience bears the sweetest fruit |
| 4 | Meitei | Love and courage as human virtues |
| 5 | Assamese | Embracing the present moment |
| 6 | Assamese | Home always lives in the heart (memory) |
| 7 | Assamese | Old trees have deep roots — wisdom with age |
| 8 | Assamese | Small steps complete the longest journey |

**Rotation:** Starts on today's day-of-year index. Tap the card → Y-axis flip animation → next quote.

---

## EAS Build Configuration

**File:** `eas.json`

```json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": { "autoIncrement": true }
  }
}
```

- Use `preview` profile for direct APK installation (sideloading / demo)
- Use `production` profile for Play Store AAB upload
- `GEMINI_API_KEY` must be set as an EAS secret for voice features to work

**Build command:**
```
eas build --platform android --profile preview
```

---

## Dependency Notes

| Package | Version | Note |
|---|---|---|
| `expo` | `~54.0.0` | SDK 54 |
| `expo-speech-recognition` | `3.1.3` | Must be 3.x for SDK 54. Do NOT use 56.x (built for SDK 56, causes `OptimizedRecord` Gradle error) |
| `expo-notifications` | `~0.32.0` | Wired for daily reminder scheduling |
| `expo-speech` | `~14.0.8` | TTS for voice assistant read-aloud |

---

## Known Gaps / Not Yet Implemented

| Feature | Status |
|---|---|
| Language switching (Hindi, Assamese, Bodo) | UI only — selecting a language does not change content |
| Caregiver number for SOS | Hardcoded to `112` — no settings screen to save a custom number |
| Gemini API key in production | Must be set as EAS secret `GEMINI_API_KEY` — voice AI silent-fails without it |
| Offline Gemini fallback | No offline responses for voice assistant |
| Adaptive difficulty (AI/ML) | Not implemented |
| Separate caregiver dashboard | Caregivers land on MonitorScreen — no dedicated caregiver-only view |
