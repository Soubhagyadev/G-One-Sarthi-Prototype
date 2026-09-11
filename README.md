# G-One Sarthi

G-One Sarthi is an AI-powered cognitive assistance mobile application built for elderly dementia and Alzheimer's patients in the North Eastern Region of India. It was developed as a submission for Smart India Hackathon 2026.

The application serves two user types: patients who engage with cognitive games and reminders, and caregivers who monitor patient progress through an analytics dashboard.

## Problem Statement

The North Eastern Region of India faces a growing challenge of age-related cognitive disorders among the elderly, particularly in rural and remote areas where access to neurological care and cognitive therapy is severely limited. Elderly patients with dementia experience memory decline, confusion, anxiety, and social isolation. Caregivers face difficulties in continuous monitoring and engagement. There are few affordable digital therapeutic solutions tailored to the cultural and linguistic context of NER.

## Solution

G-One Sarthi provides an accessible, culturally grounded cognitive assistance platform with the following capabilities.

Adaptive cognitive games targeting memory, attention, pattern recognition, emotional recognition, and face recognition. All games feature NE Indian themed visuals, illustrations, and culturally familiar content.

A reminder system that allows caregivers or patients to set daily medication, hydration, and activity reminders with a native time picker. Reminders surface on the home screen and can be marked complete.

A caregiver analytics dashboard showing today's game completion summary, day streak, reminder adherence, last active time, and a 7-day activity history chart.

A daily streak tracker that records consecutive days of engagement and persists across app restarts.

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | React Native with Expo SDK 54 |
| Navigation | Screen state managed in App.tsx |
| Storage | AsyncStorage for streak, history, and daily progress |
| Fonts | Lora Medium and Bold |
| Icons | SVG via react-native-svg |
| Time Picker | @react-native-community/datetimepicker |

## Screens

### Role Selection

<img src="app_image/Main_Screen.png" width="320" />

The entry screen where the user identifies as a patient or caregiver. Includes a language selector for English, Hindi, Assamese, and Bodo.

### Patient Name Entry

<img src="app_image/Asking_For_Name.png" width="320" />

Patients enter their name before proceeding. The name is used throughout the app for personalised greetings.

### Welcome Screen

<img src="app_image/Welcome_Screen.png" width="320" />

A full-screen culturally themed illustration welcoming the patient by name. Tap anywhere to continue.

### Caregiver Login

<img src="app_image/Login_Screen_Caregiver.png" width="320" />

Caregivers log in with email and password to access the monitoring dashboard directly.

### Home

<img src="app_image/Home.png" width="320" />

The patient dashboard shows a personalised greeting with real date and time of day, a day streak counter, today's game completion and reminder progress, a quick play button for a random game, and the next upcoming reminder with a checkmark to mark it done.

### Games

<img src="app_image/Games.png" width="320" />

Lists all five cognitive games. Each game is designed around a specific cognitive domain relevant to dementia care.

**Travel Rating** recognises emotions from facial expressions using NE Indian face illustrations across 6 rounds.

**Match Pairs** is a classic memory card flip game with 8 pairs of NE Indian themed images.

**Pack Your Bags** presents reasoning scenarios about a character named Maya and asks the patient to choose the correct item to pack for a trip across 6 rounds.

**Watch The Tray** shows a set of household objects for a timed memorisation period, then asks the patient to recall which items were on the tray. Available in Easy, Medium, and Hard difficulty.

**People Face** shows four faces with name badges for 8 seconds, then quizzes the patient on each face one by one.

### Voice Assistant

<img src="app_image/Voice_Assistant.png" width="320" />

Planned feature for multilingual voice interaction. The screen describes the intended capabilities including reading reminders aloud, answering health questions, and offline support.

### Monitor and Analytics

<img src="app_image/Monitor Health.png" width="320" />

The caregiver and patient monitor screen has two sections.

The reminders section allows adding, editing, and deleting daily reminders with a native clock time picker and icon selection for medicine, water, and walking activities.

The analytics section shows a today summary card with games played, current streak, and reminders completed; a last active card showing when the patient last opened the app; a reminders today progress bar; a 7-day activity bar chart showing games played per day; and a per-game performance list showing which games were completed today.

## Running the App

```
npm install
npx expo start
```

Scan the QR code with Expo Go on Android or iOS.

## Project Context

Competition: Smart India Hackathon 2026
Problem Domain: Elderly healthcare and cognitive assistance in NER India
Target Users: Elderly dementia and Alzheimer's patients and their caregivers in rural and remote NE India
