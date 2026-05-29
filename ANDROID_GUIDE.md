# Android App — Step by Step Guide

Unlike iOS, you can build Android apps on Mac, Windows, or Linux.

---

## PART 1: One-Time Setup (~20 min with downloads)

### 1a. Install Android Studio

Go to https://developer.android.com/studio and download Android Studio. Install it like any other app.

When you open it the first time, it will ask you to download the Android SDK. Click through the setup wizard and let it install everything with the default options. This takes a few minutes.

### 1b. Google Play Developer Account

Go to https://play.google.com/console and sign up. There's a one-time $25 fee (not yearly like Apple). This is required to publish to the Play Store.

---

## PART 2: Set Up the Project

### 2a. Navigate to your project

Open your terminal and go to the project folder:

```bash
cd ~/Desktop/book1-interactive-app-v2
```

### 2b. Make sure your .env file exists

If you haven't already:

```bash
cp .env.example .env
```

Edit `.env` and add your real Supabase credentials.

### 2c. Install dependencies

```bash
npm install
```

### 2d. Initialize the Android project

```bash
npx cap add android
```

This creates an `android` folder with a full Android Studio project. You only do this once.

### 2e. Build and sync

```bash
npm run build:android
```

---

## PART 3: Open in Android Studio

```bash
npm run open:android
```

Android Studio opens. The first time, it may need to download Gradle files and sync — let it finish. You will see progress bars at the bottom. Wait until they are done.

---

## PART 4: Test On Your Phone

### 4a. Enable Developer Mode on your Android phone

1. Go to **Settings → About Phone**
2. Tap **"Build Number"** seven times quickly
3. You will see a toast message: "You are now a developer"
4. Go back to **Settings → Developer Options** (might be under System)
5. Turn on **USB Debugging**

### 4b. Connect your phone

Plug your phone into your computer with a USB cable. Your phone will ask "Allow USB debugging?" — tap **Allow**.

### 4c. Run it

In Android Studio, your phone should appear in the device dropdown at the top. Select it and click the **green play button** (▶). The app installs on your phone.

---

## PART 5: Submit to the Google Play Store

### 5a. Create a signed release build

In Android Studio:

1. Go to **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle** and click Next
3. Click **Create New** to make a signing key:
   - Key store path: pick a safe location and name it `upload-keystore.jks`
   - Set a password (write it down — you need it for every update)
   - Fill in at least your name
   - Click OK
4. Select your new key, enter the passwords, click Next
5. Select **release** and click **Create**

The signed `.aab` file will be in `android/app/release/`.

**IMPORTANT**: Back up your `upload-keystore.jks` file and passwords somewhere safe. If you lose them, you can never update your app.

### 5b. Create the Play Store listing

1. Go to https://play.google.com/console
2. Click **Create App**
3. Fill in:
   - App name: **Stop Being Emotionally Reactive**
   - Default language: English
   - App type: App
   - Free or Paid: your choice
   - Declarations: check the required boxes
4. Click **Create App**

### 5c. Fill in the store listing

Under **Main store listing**, you need:
- **Short description**: up to 80 characters (e.g., "A 30-day workbook to understand your triggers and stop reactive patterns")
- **Full description**: up to 4000 characters
- **App icon**: 512x512 PNG
- **Feature graphic**: 1024x500 PNG (a banner image)
- **Screenshots**: at least 2 phone screenshots, take them on your device

### 5d. Complete the required sections

Google requires you to fill out several sections before you can publish. In the left sidebar, look for items with warning icons. The main ones:

- **App content → Privacy policy**: add your privacy policy URL
- **App content → Ads declaration**: select "No ads"
- **App content → Content rating**: fill out the questionnaire (your app will likely be rated "Everyone")
- **App content → Target audience**: select 18+ (self-help content)
- **App content → Data safety**: declare what data you collect (email for accounts, journal entries stored in Supabase)

### 5e. Upload the build

1. In the left sidebar, go to **Production** (under Release)
2. Click **Create new release**
3. Upload the `.aab` file from step 5a
4. Add release notes (e.g., "Initial release")
5. Click **Review release** → **Start rollout to Production**

### 5f. Wait for review

Google's review typically takes a few hours to 3 days. They will email you when the app is approved or if changes are needed.

---

## Updating the App Later

When you change the web code:

```bash
npm run build:android
npm run open:android
```

In Android Studio: bump the `versionCode` and `versionName` in `android/app/build.gradle`, build a new signed bundle, and upload it to Play Console.

---

## Common Issues

**"SDK not found" error**: Open Android Studio → Settings → Languages & Frameworks → Android SDK. Make sure an SDK is installed. Click "Edit" next to SDK Location if the path is wrong.

**Gradle sync fails**: Usually means Android Studio needs to download files. Wait for it to finish. If it hangs, go to File → Invalidate Caches → Restart.

**App crashes on launch**: Check that your `.env` file has the correct Supabase values before running `npm run build:android`.

**White flash on app start**: This is normal — the splash screen replaces it after a moment. The `backgroundColor` in the Capacitor config controls the flash color (set to cream to match).
