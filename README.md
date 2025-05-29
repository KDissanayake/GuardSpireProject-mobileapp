# GuardSpireProject-mobileapp

This repository contains the **mobile application** for the GuardSpire project, developed using **React Native**. It communicates with the backend via REST APIs and provides a user-friendly interface for interaction with the system.

---

## 📱 How to Run the Mobile App

### ✅ Prerequisites

- Node.js and npm
- Android Studio
- React Native CLI
- Android Emulator or a connected device
- Backend server running at `http://localhost:5000`

---

### 🛠️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/KDissanayake/GuardSpireProject-mobileapp.git
   cd GuardSpireProject-mobileapp


2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start Android Emulator or connect a device.**

4. **Set up reverse port to communicate with the backend (if running on physical device or emulator):**

   ```bash
   adb reverse tcp:5000 tcp:5000
   ```

5. **Run the mobile application:**

   ```bash
   npx react-native run-android
   ```

---

## 🌐 Backend Integration

Ensure the backend (Flask) server is already running at:

```
http://localhost:5000
```

Otherwise, refer to the backend repo [here](https://github.com/KDissanayake/GuardSpireProject-backend) for setup.

---

## 🧾 Notes

* This app uses data from the NLP and Backend modules via REST APIs.
* Modify the `fetch`/API base URL in the code if needed to match your backend deployment setup.

---

## ✅ Tested With

* Android Emulator (Pixel 7, API 36)
* Android physical device via USB debugging

---

