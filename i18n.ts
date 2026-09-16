// G-One Sarthi — Translations
// Languages: English, Assamese (অসমীয়া), Hindi (हिन्दी), Bodo (बड़ो)
// Assamese uses Bengali/Assamese script → NotoSerifBengali font
// Hindi & Bodo use Devanagari script → NotoSerifDevanagari font

export type Language = 'English' | 'Assamese' | 'Hindi' | 'Bodo';

export const translations = {

  // ── Main Screen ──────────────────────────────────────────────
  welcome: {
    English: 'Welcome To\nG-One Sarthi',
    Assamese: 'G-One Sarthi লৈ\nস্বাগতম',
    Hindi: 'G-One Sarthi में\nआपका स्वागत है',
    Bodo: 'G-One Sarthi आ\nफिसाजो',
  },
  subtitle: {
    English: 'An AI Based Companion\nFor Elderly Patient Suffering From Dementia & Alzheimers',
    Assamese: 'ডিমেনচিয়া আৰু আলঝেইমাৰ ৰোগীৰ বাবে\nএক AI ভিত্তিক সহায়ক',
    Hindi: 'डिमेंशिया और अल्जाइमर से पीड़ित\nबुजुर्गों के लिए AI सहायक',
    Bodo: 'डिमेंशिया आरो अल्जाइमर बिमारसे\nबुजुर्गसोर लागिर AI सहायक',
  },
  imPatient: {
    English: "I'm a Patient",
    Assamese: 'মই এজন ৰোগী',
    Hindi: 'मैं एक मरीज़ हूँ',
    Bodo: 'बे बिमार मोन',
  },
  imCaregiver: {
    English: "I'm a Caregiver",
    Assamese: 'মই এজন চিকিৎসাকাৰী',
    Hindi: 'मैं एक देखभालकर्ता हूँ',
    Bodo: 'बे थाখौ फोसाब्लाइ',
  },

  // ── AskingForName ─────────────────────────────────────────────
  whatsYourName: {
    English: "What's\nYour Name?",
    Assamese: 'আপোনাৰ নাম\nকি?',
    Hindi: 'आपका नाम\nक्या है?',
    Bodo: 'नोंनि मिथिं\nमा?',
  },
  namePlaceholder: {
    English: 'Enter your name',
    Assamese: 'আপোনাৰ নাম দিয়ক',
    Hindi: 'अपना नाम लिखें',
    Bodo: 'नोंनि मिथिं लिखो',
  },
  proceed: {
    English: 'Proceed',
    Assamese: 'আগবাঢ়ক',
    Hindi: 'आगे बढ़ें',
    Bodo: 'थाखिजो',
  },
  back: {
    English: '‹ Back',
    Assamese: '‹ উভতি যাওক',
    Hindi: '‹ वापस',
    Bodo: '‹ उलाय',
  },

  // ── Welcome Screen ────────────────────────────────────────────
  welcomePatient: {
    English: 'Welcome,',
    Assamese: 'স্বাগতম,',
    Hindi: 'स्वागत है,',
    Bodo: 'फिसाजो,',
  },
  tapToContinue: {
    English: 'Tap anywhere to continue',
    Assamese: 'আগবাঢ়িবলৈ যিকোনো ঠাইত টেপ কৰক',
    Hindi: 'जारी रखने के लिए कहीं भी टैप करें',
    Bodo: 'बारलांनाय लागिर नखर खोमो नाय टेप दो',
  },

  // ── Login Screen ──────────────────────────────────────────────
  welcomeCaregiver: {
    English: 'Welcome\nCaregiver',
    Assamese: 'স্বাগতম\nচিকিৎসাকাৰী',
    Hindi: 'स्वागत है\nदेखभालकर्ता',
    Bodo: 'फिसाजो\nफोसाब्लाइ',
  },
  emailPlaceholder: {
    English: 'Email Address',
    Assamese: 'ইমেইল ঠিকনা',
    Hindi: 'ईमेल पता',
    Bodo: 'ईमेल थाखो',
  },
  passwordPlaceholder: {
    English: 'Password',
    Assamese: 'পাছৱৰ্ড',
    Hindi: 'पासवर्ड',
    Bodo: 'पासवर्ड',
  },
  signIn: {
    English: 'Sign In',
    Assamese: 'প্ৰৱেশ কৰক',
    Hindi: 'साइन इन करें',
    Bodo: 'साइन इन',
  },

  // ── Home Screen ───────────────────────────────────────────────
  goodMorning: {
    English: 'Good Morning',
    Assamese: 'শুভ পুৱা',
    Hindi: 'शुभ प्रभात',
    Bodo: 'सुबाइ नों',
  },
  goodAfternoon: {
    English: 'Good Afternoon',
    Assamese: 'শুভ দুপৰীয়া',
    Hindi: 'शुभ दोपहर',
    Bodo: 'बेलोसिनि नों',
  },
  goodEvening: {
    English: 'Good Evening',
    Assamese: 'শুভ সন্ধিয়া',
    Hindi: 'शुभ संध्या',
    Bodo: 'साँजनि नों',
  },
  goodNight: {
    English: 'Good Night',
    Assamese: 'শুভ ৰাতি',
    Hindi: 'शुभ रात्रि',
    Bodo: 'बोसोरनि नों',
  },
  streakDays: {
    English: (n: number) => n === 1 ? 'You Have Been Playing For 1 Day' : `You Have Been Playing For ${n} Days`,
    Assamese: (n: number) => `আপুনি ${n} দিন ধৰি খেলি আছে`,
    Hindi: (n: number) => `आप ${n} दिन से खेल रहे हैं`,
    Bodo: (n: number) => `नों ${n} सान थाखि खेलिबोदों`,
  },
  yourPerformance: {
    English: 'Your Performance',
    Assamese: 'আপোনাৰ প্ৰদৰ্শন',
    Hindi: 'आपका प्रदर्शन',
    Bodo: 'नोंनि खेलाखेलि',
  },
  littleProgress: {
    English: 'A Little Progress Makes a Big Difference',
    Assamese: 'অলপ উন্নতিয়েও বহু পৰিৱৰ্তন আনে',
    Hindi: 'थोड़ी प्रगति भी बड़ा फर्क लाती है',
    Bodo: 'थोरै बारलांनायनो गोदान फारसे',
  },
  memoryGames: {
    English: 'Memory Games',
    Assamese: 'স্মৃতি খেলা',
    Hindi: 'स्मृति खेल',
    Bodo: 'मोनसे खेला',
  },
  remindersSet: {
    English: 'Reminders Set',
    Assamese: 'ৰিমাইণ্ডাৰ',
    Hindi: 'रिमाइंडर',
    Bodo: 'रिमाइंडार',
  },
  completed: {
    English: 'Completed',
    Assamese: 'সম্পূৰ্ণ',
    Hindi: 'पूर्ण',
    Bodo: 'समापन',
  },
  doingWell: {
    English: 'You are doing well keep it up!!',
    Assamese: 'আপুনি ভালকৈ কৰি আছে, চলি থাকক!!',
    Hindi: 'आप बहुत अच्छा कर रहे हैं, जारी रखें!!',
    Bodo: 'नों गोलाव खेलिबोदों, थाखिया!!',
  },
  todaysGame: {
    English: "Today's Game Exercise For You",
    Assamese: 'আজিৰ খেলাৰ ব্যায়াম আপোনাৰ বাবে',
    Hindi: 'आज का खेल अभ्यास आपके लिए',
    Bodo: 'आजिनि खेला नोंनि लागिर',
  },
  play: {
    English: '▶ Play',
    Assamese: '▶ খেলক',
    Hindi: '▶ खेलें',
    Bodo: '▶ खेलो',
  },
  reminders: {
    English: 'Reminders',
    Assamese: 'ৰিমাইণ্ডাৰ',
    Hindi: 'रिमाइंडर',
    Bodo: 'रिमाइंडार',
  },
  noReminders: {
    English: 'No upcoming reminders for today.',
    Assamese: 'আজিৰ বাবে কোনো ৰিমাইণ্ডাৰ নাই।',
    Hindi: 'आज के लिए कोई रिमाइंडर नहीं।',
    Bodo: 'आजिनि लागिर रिमाइंडार नाङा।',
  },
  tapForQuote: {
    English: 'Tap for another quote ↻',
    Assamese: 'আন এটা উক্তিৰ বাবে টেপ কৰক ↻',
    Hindi: 'दूसरा उद्धरण के लिए टैप करें ↻',
    Bodo: 'बेसेन कथा लागिर टेप दो ↻',
  },
  emergencySOS: {
    English: 'Emergency SOS',
    Assamese: 'জৰুৰী SOS',
    Hindi: 'आपातकालीन SOS',
    Bodo: 'जरुरि SOS',
  },
  sosSubtitle: {
    English: 'Tap to call for help immediately',
    Assamese: 'সহায়ৰ বাবে এতিয়াই টেপ কৰক',
    Hindi: 'तुरंत सहायता के लिए टैप करें',
    Bodo: 'थांखिनि फोसाबनाय लागिर टेप दो',
  },
  sosConfirmTitle: {
    English: '🚨 Emergency SOS',
    Assamese: '🚨 জৰুৰী SOS',
    Hindi: '🚨 आपातकालीन SOS',
    Bodo: '🚨 जरुरि SOS',
  },
  sosConfirmMessage: {
    English: (phone: string) => `Call ${phone === '112' ? 'Emergency Services (112)' : 'your caregiver'} now?`,
    Assamese: (phone: string) => `${phone === '112' ? 'জৰুৰীকালীন সেৱা (112)' : 'আপোনাৰ চিকিৎসাকাৰী'}লৈ এতিয়াই ফোন কৰিবনে?`,
    Hindi: (phone: string) => `${phone === '112' ? 'आपातकालीन सेवा (112)' : 'अपने देखभालकर्ता'} को अभी कॉल करें?`,
    Bodo: (phone: string) => `${phone === '112' ? 'जरुरि सेवा (112)' : 'नोंनि फोसाब्लाइ'}लाइ एखेव फोन दोबाय?`,
  },
  cancel: {
    English: 'Cancel',
    Assamese: 'বাতিল কৰক',
    Hindi: 'रद्द करें',
    Bodo: 'रद्द',
  },
  callNow: {
    English: 'Call Now',
    Assamese: 'এতিয়াই ফোন কৰক',
    Hindi: 'अभी कॉल करें',
    Bodo: 'एखेव फोन दो',
  },

  // ── Games Screen ──────────────────────────────────────────────
  gamesCurated: {
    English: 'Games Curated\nJust For You',
    Assamese: 'আপোনাৰ বাবে\nবিশেষভাৱে খেলা',
    Hindi: 'आपके लिए\nविशेष खेल',
    Bodo: 'नोंनि लागिर\nखेला',
  },
  gameTravelRating: {
    English: 'Travel Rating',
    Assamese: 'ট্ৰেভেল ৰেটিং',
    Hindi: 'ट्रैवल रेटिंग',
    Bodo: 'ट्रैवल रेटिंग',
  },
  gameTravelSubtitle: {
    English: 'Emotion recognition / social cognition',
    Assamese: 'আৱেগ চিনাক্তকৰণ / সামাজিক জ্ঞান',
    Hindi: 'भावना पहचान / सामाजिक बोध',
    Bodo: 'मोनभाव थाखिनाय',
  },
  gameMatchPairs: {
    English: 'Match Pairs',
    Assamese: 'মেচ পেয়াৰ',
    Hindi: 'मैच पेयर्स',
    Bodo: 'मैच पेयार',
  },
  gameMatchSubtitle: {
    English: 'Helps with the memory',
    Assamese: 'স্মৃতিশক্তি উন্নত কৰে',
    Hindi: 'स्मृति में सुधार करता है',
    Bodo: 'मोनसे बारलांनाय',
  },
  gamePackBags: {
    English: 'Pack Your Bags',
    Assamese: 'বেগ পেক কৰক',
    Hindi: 'बैग पैक करें',
    Bodo: 'बेग पेक दो',
  },
  gamePackSubtitle: {
    English: 'Pattern Recognition',
    Assamese: 'নিদৰ্শন চিনাক্তকৰণ',
    Hindi: 'पैटर्न पहचान',
    Bodo: 'पेटार्न थाखिनाय',
  },
  gameWatchTray: {
    English: 'Watch The Tray',
    Assamese: 'ট্ৰে চাওক',
    Hindi: 'ट्रे देखें',
    Bodo: 'ट्रे गावो',
  },
  gameWatchSubtitle: {
    English: 'Memory',
    Assamese: 'স্মৃতিশক্তি',
    Hindi: 'स्मृति',
    Bodo: 'मोनसे',
  },
  gamePeopleFace: {
    English: 'People Face',
    Assamese: 'মানুহৰ মুখ',
    Hindi: 'लोगों के चेहरे',
    Bodo: 'मानुसिनि मुं',
  },
  gamePeopleSubtitle: {
    English: 'Recognition',
    Assamese: 'চিনাক্তকৰণ',
    Hindi: 'पहचान',
    Bodo: 'थाखिनाय',
  },

  // ── Voice Screen ──────────────────────────────────────────────
  askAnything: {
    English: 'Ask\nAnything',
    Assamese: 'যিকোনো কথা\nসোধক',
    Hindi: 'कुछ भी\nपूछें',
    Bodo: 'नखर लाय\nदाफोर दो',
  },
  tapToSpeak: {
    English: 'Tap to speak',
    Assamese: `কথা ক'বলৈ টেপ কৰক`,
    Hindi: 'बोलने के लिए टैप करें',
    Bodo: 'हो बायनाय लागिर टेप दो',
  },
  listeningStop: {
    English: 'Listening... tap to stop',
    Assamese: 'শুনি আছে... বন্ধ কৰিবলৈ টেপ কৰক',
    Hindi: 'सुन रहे हैं... रोकने के लिए टैप करें',
    Bodo: 'थांखिबोदों... बन्द लागिर टेप दो',
  },
  typeQuestion: {
    English: 'Or type your question here...',
    Assamese: 'বা ইয়াত আপোনাৰ প্ৰশ্ন লিখক...',
    Hindi: 'या यहाँ अपना प्रश्न लिखें...',
    Bodo: 'नाथाय इयाव नोंनि दाफोर लिखो...',
  },
  ask: {
    English: 'Ask',
    Assamese: 'সোধক',
    Hindi: 'पूछें',
    Bodo: 'दाफोर दो',
  },
  readAloud: {
    English: 'Read Aloud',
    Assamese: 'জোৰেৰে পঢ়ক',
    Hindi: 'ज़ोर से पढ़ें',
    Bodo: 'दाग दिनाय',
  },
  stop: {
    English: 'Stop',
    Assamese: 'বন্ধ কৰক',
    Hindi: 'रोकें',
    Bodo: 'बन्द',
  },
  comingSoon: {
    English: 'Coming Soon',
    Assamese: 'সোনকালে আহিব',
    Hindi: 'जल्द आ रहा है',
    Bodo: 'बारायनो लागिब',
  },
  voiceInputTitle: {
    English: 'Voice Input',
    Assamese: 'ভইচ ইনপুট',
    Hindi: 'वॉइस इनपुट',
    Bodo: 'भोइस इनपुट',
  },
  voiceInputBody: {
    English: 'Speak directly to G-One Sarthi in Assamese, Hindi, Bodo, or English. Requires a development build.',
    Assamese: 'অসমীয়া, হিন্দী, বড়ো বা ইংৰাজীত G-One Sarthi ক পোনপটীয়াকৈ কথা কওক।',
    Hindi: 'असमिया, हिंदी, बोडो या अंग्रेजी में सीधे G-One Sarthi से बात करें।',
    Bodo: 'असमिया, हिन्दी, बड़ो आरो इंरेजिनि G-One Sarthi आव हो बायो।',
  },
  toastReminderSet: {
    English: 'Reminder Set!',
    Assamese: `ৰিমাইণ্ডাৰ ছেট হ'ল!`,
    Hindi: 'रिमाइंडर सेट हो गया!',
    Bodo: 'रिमाइंडार लाखिजो!',
  },

  // ── Monitor Screen ────────────────────────────────────────────
  addReminders: {
    English: 'Add Reminders',
    Assamese: 'ৰিমাইণ্ডাৰ যোগ কৰক',
    Hindi: 'रिमाइंडर जोड़ें',
    Bodo: 'रिमाइंडार लाखो',
  },
  addAnotherReminder: {
    English: '+ Add another reminder',
    Assamese: '+ আন এটা ৰিমাইণ্ডাৰ যোগ কৰক',
    Hindi: '+ एक और रिमाइंडर जोड़ें',
    Bodo: '+ बेसेन रिमाइंडार लाखो',
  },
  reminderExample: {
    English: 'Example: Remember To Take Medicine at 10:00PM',
    Assamese: 'উদাহৰণ: ৰাতি ১০:০০ বজাত দৰব খাবলৈ মনত ৰাখক',
    Hindi: 'उदाहरण: रात 10:00 बजे दवाई लेना याद रखें',
    Bodo: 'उदाहरण: राति 10:00 बजे दाइ थाखो',
  },
  analytics: {
    English: 'Analytics',
    Assamese: 'বিশ্লেষণ',
    Hindi: 'विश्लेषण',
    Bodo: 'बिसायखि',
  },
  todaysSummary: {
    English: "Today's Summary",
    Assamese: 'আজিৰ সাৰাংশ',
    Hindi: 'आज का सारांश',
    Bodo: 'आजिनि खोथा',
  },
  gamesPlayed: {
    English: 'Games\nPlayed',
    Assamese: 'খেলা\nখেলিলে',
    Hindi: 'खेल\nखेले',
    Bodo: 'खेला\nखेलिजो',
  },
  dayStreak: {
    English: 'Day\nStreak',
    Assamese: 'দিনৰ\nধাৰা',
    Hindi: 'दिन की\nलकीर',
    Bodo: 'सानि\nसिरिज',
  },
  remindersDone: {
    English: 'Reminders\nDone',
    Assamese: 'ৰিমাইণ্ডাৰ\nসম্পূৰ্ণ',
    Hindi: 'रिमाइंडर\nपूर्ण',
    Bodo: 'रिमाइंडार\nसमापन',
  },
  lastActive: {
    English: 'Last Active',
    Assamese: 'শেষ সক্ৰিয়',
    Hindi: 'अंतिम सक्रिय',
    Bodo: 'गोजान एखेव',
  },
  remindersToday: {
    English: 'Reminders Today',
    Assamese: 'আজিৰ ৰিমাইণ্ডাৰ',
    Hindi: 'आज के रिमाइंडर',
    Bodo: 'आजिनि रिमाइंडार',
  },
  allDone: {
    English: 'All done! Great job.',
    Assamese: `সকলো হ'ল! বহুত ভাল।`,
    Hindi: 'सब हो गया! बहुत अच्छे।',
    Bodo: 'मोन समापन! गोलाव।',
  },
  noneCompleted: {
    English: 'None completed yet',
    Assamese: 'এতিয়ালৈকে কোনোটো সম্পূৰ্ণ হোৱা নাই',
    Hindi: 'अभी तक कुछ पूरा नहीं हुआ',
    Bodo: 'एखेव समापन नाङा',
  },
  remaining: {
    English: (n: number) => `${n} remaining`,
    Assamese: (n: number) => `${n} টা বাকী`,
    Hindi: (n: number) => `${n} बाकी`,
    Bodo: (n: number) => `${n} थाखिजो`,
  },
  sevenDayActivity: {
    English: '7-Day Activity',
    Assamese: '৭ দিনৰ কাৰ্যকলাপ',
    Hindi: '7 दिन की गतिविधि',
    Bodo: '7 सानि खेलाखेलि',
  },
  gamesPerDay: {
    English: 'Games played per day',
    Assamese: 'প্ৰতিদিন খেলা খেলা',
    Hindi: 'प्रतिदिन खेले गए खेल',
    Bodo: 'सानेसानে खेलिजो खेला',
  },
  gamePerformance: {
    English: 'Game Performance',
    Assamese: 'খেলাৰ প্ৰদৰ্শন',
    Hindi: 'खेल प्रदर्शन',
    Bodo: 'खेलानि बिसायखि',
  },
  caregiverNotes: {
    English: 'Caregiver Notes',
    Assamese: 'চিকিৎসাকাৰীৰ টোকা',
    Hindi: 'देखभालकर्ता के नोट्स',
    Bodo: 'फोसाब्लाइनि नट',
  },
  caregiverNotesHint: {
    English: "Write today's observations about the patient — mood, behaviour, any concerns.",
    Assamese: 'ৰোগীৰ বিষয়ে আজিৰ পৰ্যবেক্ষণ লিখক — মনৰ অৱস্থা, আচৰণ, যিকোনো উদ্বেগ।',
    Hindi: 'मरीज़ के बारे में आज की टिप्पणियाँ लिखें — मनोदशा, व्यवहार, कोई चिंता।',
    Bodo: 'बिमारनि थाखाय आजिनि गावखि लिखो — मोन, बेहाव, नखर दुखु।',
  },
  caregiverNotesPlaceholder: {
    English: 'e.g. Seemed calm today, completed all games, had a good appetite...',
    Assamese: 'যেনে: আজি শান্ত আছিল, সকলো খেলা সম্পূৰ্ণ কৰিলে...',
    Hindi: 'जैसे: आज शांत लगे, सभी खेल पूरे किए...',
    Bodo: 'उदाहरण: आजि सान्थि आसिल, मोन खेला समापन...',
  },
  saveNotes: {
    English: 'Save Notes',
    Assamese: 'টোকা সংৰক্ষণ কৰক',
    Hindi: 'नोट्स सहेजें',
    Bodo: 'नट लाखो',
  },
  saved: {
    English: '✓ Saved',
    Assamese: '✓ সংৰক্ষিত',
    Hindi: '✓ सहेजा गया',
    Bodo: '✓ लाखिजो',
  },
  reminderSavedAlert: {
    English: (label: string, time: string) => `${label} is set for ${time}. You will get a daily notification.`,
    Assamese: (label: string, time: string) => `${label} ${time} ৰ বাবে ছেট কৰা হৈছে। আপুনি প্ৰতিদিন জাননী পাব।`,
    Hindi: (label: string, time: string) => `${label} ${time} के लिए सेट किया गया है। आपको रोज़ सूचना मिलेगी।`,
    Bodo: (label: string, time: string) => `${label} ${time} लागिर लाखिजो। नों सानेसाने जानिनाय पाब।`,
  },
  checkReminder: {
    English: 'Check reminder',
    Assamese: 'ৰিমাইণ্ডাৰ পৰীক্ষা কৰক',
    Hindi: 'रिमाइंडर जाँचें',
    Bodo: 'रिमाइंडार गावो',
  },
  checkReminderMsg: {
    English: 'Enter a label and a time such as 8:00 PM.',
    Assamese: 'এটা লেবেল আৰু সময় দিয়ক যেনে ৰাতি ৮:০০।',
    Hindi: 'एक लेबल और समय जैसे 8:00 PM दर्ज करें।',
    Bodo: 'लेबल आरो 8:00 PM सिगांसे थाखो दो।',
  },

  // ── Nav bar ───────────────────────────────────────────────────
  navHome: {
    English: 'Home',
    Assamese: 'ঘৰ',
    Hindi: 'होम',
    Bodo: 'हों',
  },
  navGames: {
    English: 'Games',
    Assamese: 'খেলা',
    Hindi: 'खेल',
    Bodo: 'खेला',
  },
  navVoice: {
    English: 'Voice Chat',
    Assamese: 'ভইচ চেট',
    Hindi: 'वॉइस चैट',
    Bodo: 'भोइस चेट',
  },
  navMonitor: {
    English: 'Monitor',
    Assamese: 'মনিটৰ',
    Hindi: 'मॉनिटर',
    Bodo: 'मनिटार',
  },

  // ── Game screens shared ───────────────────────────────────────
  exitGame: {
    English: '✕ Exit',
    Assamese: '✕ ওলাই যাওক',
    Hindi: '✕ बाहर निकलें',
    Bodo: '✕ बाहार',
  },
  score: {
    English: 'Score',
    Assamese: 'স্কোৰ',
    Hindi: 'स्कोर',
    Bodo: 'স্কোর',
  },
  playAgain: {
    English: 'Play Again',
    Assamese: 'আকৌ খেলক',
    Hindi: 'फिर से खेलें',
    Bodo: 'बाय खेलो',
  },
  backToGames: {
    English: 'Back To Games',
    Assamese: 'খেলালৈ উভতি যাওক',
    Hindi: 'खेल में वापस जाएं',
    Bodo: 'खेलाव उलाय',
  },
  next: {
    English: 'Next',
    Assamese: 'পৰৱৰ্তী',
    Hindi: 'अगला',
    Bodo: 'बाहाब',
  },
  correct: {
    English: 'Correct!',
    Assamese: 'শুদ্ধ!',
    Hindi: 'सही!',
    Bodo: 'सोलाय!',
  },
  incorrect: {
    English: 'Not quite right',
    Assamese: 'সঠিক নহয়',
    Hindi: 'सही नहीं',
    Bodo: 'सोलाय नाङा',
  },

  // ── Travel Rating game ────────────────────────────────────────
  travelGameTitle: {
    English: 'Travel Rating',
    Assamese: 'ট্ৰেভেল ৰেটিং',
    Hindi: 'ट्रैवल रेटिंग',
    Bodo: 'ट्रैवल रेटिंग',
  },
  howFeeling: {
    English: 'How is this person feeling?',
    Assamese: 'এই মানুহজনে কেনে অনুভৱ কৰি আছে?',
    Hindi: 'यह व्यक्ति कैसा महसूस कर रहा है?',
    Bodo: 'बे मानुसिनि मोन केरे आसो?',
  },
  nextPerson: {
    English: 'Next Person',
    Assamese: 'পৰৱৰ্তী মানুহ',
    Hindi: 'अगला व्यक्ति',
    Bodo: 'बाहाब मानुस',
  },
  travelGameResult: {
    English: (score: number) => `You recognised ${score} out of 6 emotions correctly!`,
    Assamese: (score: number) => `আপুনি ৬টাৰ ভিতৰত ${score}টা আৱেগ সঠিকভাৱে চিনাক্ত কৰিলে!`,
    Hindi: (score: number) => `आपने 6 में से ${score} भावनाएं सही पहचानीं!`,
    Bodo: (score: number) => `नों 6 सिगांसे ${score} मोनभाव सोलायाव थाखिजो!`,
  },

  // ── Match Pairs game ──────────────────────────────────────────
  matchPairsTitle: {
    English: 'Match Pairs',
    Assamese: 'মেচ পেয়াৰ',
    Hindi: 'मैच पेयर्स',
    Bodo: 'मैच पेयार',
  },
  moves: {
    English: (n: number) => `${n} Moves`,
    Assamese: (n: number) => `${n} পদক্ষেপ`,
    Hindi: (n: number) => `${n} चाल`,
    Bodo: (n: number) => `${n} खेलनाय`,
  },
  matchPairsResult: {
    English: (n: number) => `You completed the game in ${n} moves!`,
    Assamese: (n: number) => `আপুনি ${n} পদক্ষেপত খেলা সম্পূৰ্ণ কৰিলে!`,
    Hindi: (n: number) => `आपने ${n} चालों में खेल पूरा किया!`,
    Bodo: (n: number) => `नों ${n} खेलनायाव खेला समापन दोजो!`,
  },

  // ── Pack Your Bags game ───────────────────────────────────────
  packBagsTitle: {
    English: 'Pack Your Bags',
    Assamese: 'বেগ পেক কৰক',
    Hindi: 'बैग पैक करें',
    Bodo: 'बेग पेक दो',
  },
  packBagsResult: {
    English: (score: number) => `Maya is ready to travel! You chose ${score} helpful items out of 6.`,
    Assamese: (score: number) => `মায়া যাত্ৰাৰ বাবে প্ৰস্তুত! আপুনি ৬টাৰ ভিতৰত ${score}টা সঠিক বস্তু বাছনি কৰিলে।`,
    Hindi: (score: number) => `माया यात्रा के लिए तैयार है! आपने 6 में से ${score} सही वस्तुएं चुनीं।`,
    Bodo: (score: number) => `माया बिजिरनाय लागिर सोर! नों 6 सिगांसे ${score} सोलाय बस्तु बाछनि दोजो।`,
  },

  // ── Watch The Tray game ───────────────────────────────────────
  watchTrayTitle: {
    English: 'Watch The Tray',
    Assamese: 'ট্ৰে চাওক',
    Hindi: 'ट्रे देखें',
    Bodo: 'ट्रे गावो',
  },
  chooseDifficulty: {
    English: 'Choose Difficulty',
    Assamese: 'কঠিনতা বাছনি কৰক',
    Hindi: 'कठिनाई चुनें',
    Bodo: 'जोबनाय बाछनि दो',
  },
  easy: {
    English: 'Easy',
    Assamese: 'সহজ',
    Hindi: 'आसान',
    Bodo: 'सहज',
  },
  medium: {
    English: 'Medium',
    Assamese: 'মধ্যম',
    Hindi: 'मध्यम',
    Bodo: 'मध्यम',
  },
  hard: {
    English: 'Hard',
    Assamese: 'কঠিন',
    Hindi: 'कठिन',
    Bodo: 'जोब',
  },
  memoriseItems: {
    English: 'Memorise these items!',
    Assamese: 'এই বস্তুবোৰ মনত ৰাখক!',
    Hindi: 'इन वस्तुओं को याद करें!',
    Bodo: 'बे बस्तुबो मोनाव लाखो!',
  },
  selectItems: {
    English: 'Select the items you saw',
    Assamese: 'আপুনি দেখা বস্তুবোৰ বাছনি কৰক',
    Hindi: 'जो वस्तुएं आपने देखीं उन्हें चुनें',
    Bodo: 'नों गाविजो बस्तुबो बाछनि दो',
  },
  submit: {
    English: 'Submit',
    Assamese: 'জমা দিয়ক',
    Hindi: 'जमा करें',
    Bodo: 'जमा दो',
  },

  // ── People Face game ──────────────────────────────────────────
  peopleFaceTitle: {
    English: 'People Face',
    Assamese: 'মানুহৰ মুখ',
    Hindi: 'लोगों के चेहरे',
    Bodo: 'मानुसिनि मुं',
  },
  studyFaces: {
    English: 'Study these faces!',
    Assamese: 'এই মুখবোৰ মনত ৰাখক!',
    Hindi: 'इन चेहरों को याद करें!',
    Bodo: 'बे मुंबो मोनाव लाखो!',
  },
  whoIsThis: {
    English: 'Who is this?',
    Assamese: 'এইজন কোন?',
    Hindi: 'यह कौन है?',
    Bodo: 'बेनि मिथिं मा?',
  },
  youSaid: {
    English: 'You said:',
    Assamese: 'আপুনি কৈছিল:',
    Hindi: 'आपने कहा:',
    Bodo: 'नों होजो:',
  },
  peopleFaceResult: {
    English: (score: number) => `You recognised ${score} out of 4 people correctly!`,
    Assamese: (score: number) => `আপুনি ৪জনৰ ভিতৰত ${score}জনক সঠিকভাৱে চিনিলে!`,
    Hindi: (score: number) => `आपने 4 में से ${score} लोगों को सही पहचाना!`,
    Bodo: (score: number) => `नों 4 सिगांसे ${score} मानुसबो सोलायाव थाखिजो!`,
  },
} as const;

// Helper to get a translated string for a given key and language
export function t(
  key: keyof typeof translations,
  language: Language,
  ...args: any[]
): string {
  const entry = translations[key];
  if (!entry) return key;
  const value = (entry as any)[language] ?? (entry as any)['English'];
  if (typeof value === 'function') return value(...args);
  return value;
}
