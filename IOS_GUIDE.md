# iOS App — Step by Step Guide

Everything below happens on your Mac. You cannot build iOS apps on Windows.

---

## PART 1: One-Time Setup (do this once, takes ~30 min with downloads)

### 1a. Install Xcode

Open the **App Store** on your Mac. Search for **Xcode**. Install it (it's free but about 12 GB, so give it time). After it installs, open Xcode once and accept the license agreement. It will install extra components — let it finish.

Then open Terminal and run:

```bash
xcode-select --install
```

This installs command-line tools. Click "Install" when the popup appears.

### 1b. Install CocoaPods

In Terminal, run:

```bash
sudo gem install cocoapods
```

It will ask for your Mac password. Type it (you won't see characters as you type — that's normal) and press Enter.

### 1c. Apple Developer Account

Go to https://developer.apple.com/account and sign in with your Apple ID. If you haven't enrolled in the Developer Program, click "Enroll" and pay the $99/year fee. This is required to publish to the App Store. You can test on your own phone without paying, but you need the paid account to submit.

---

## PART 2: Set Up the Project

### 2a. Get the project on your Mac

If you haven't already, clone or copy the project folder to your Mac. Open Terminal and navigate into it:

```bash
cd ~/Desktop/book1-interactive-app-v2
```
(Or wherever you put it.)

### 2b. Create your .env file

```bash
cp .env.example .env
```

Open the `.env` file in any text editor and replace the placeholder values with your real Supabase credentials:

```
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

Save and close.

### 2c. Install dependencies and build

```bash
npm install
```

### 2d. Initialize the iOS project

```bash
npx cap add ios
```

This creates an `ios` folder with a full Xcode project inside it. You only need to do this once.

### 2e. Build and sync

```bash
npm run build:ios
```

This builds the web app and copies it into the iOS project.

---

## PART 3: Set Up the App in Xcode

### 3a. Open the project

```bash
npm run open:ios
```

Xcode opens with your project.

### 3b. Set your team

In Xcode, click on **"App"** in the left sidebar (the top-level project with the blue icon). Then:

1. Click the **"Signing & Capabilities"** tab
2. Check **"Automatically manage signing"**
3. Under **Team**, select your Apple Developer account
4. The **Bundle Identifier** should be `com.rileyhunt.emotionallyreactive` — change it if you want something different

### 3c. Set the app icon

1. In the left sidebar, expand **App → Assets**
2. Click **AppIcon**
3. Drag your app icon image into the slot. Apple wants a 1024x1024 PNG with no transparency and no rounded corners (iOS adds the rounding automatically)

If you don't have an icon yet, leave it blank for now — the app will still work with a default icon.

### 3d. Update the display name (optional)

In the Xcode project settings under **General**, you can change **Display Name** to whatever you want to appear under the icon on the home screen. Something like "Reactive" or "30-Day Workbook" is cleaner than the full title.

---

## PART 4: Test On Your Phone

### 4a. Connect your iPhone

Plug your iPhone into your Mac with a cable. The first time, your phone will ask "Trust this computer?" — tap **Trust**.

### 4b. Select your phone

In Xcode, at the top of the window there's a dropdown that says something like "iPhone 16 Pro" (a simulator). Click it and select your actual phone from the list.

### 4c. Run it

Click the **Play button** (▶) in the top-left corner of Xcode. The first time may take a few minutes. The app will install on your phone.

If you get a message on your phone saying the developer is not trusted:
1. Go to **Settings → General → VPN & Device Management**
2. Tap your developer email
3. Tap **Trust**
4. Go back to the app and try again

---

## PART 5: Submit to the App Store

### 5a. Create the App Store listing

1. Go to https://appstoreconnect.apple.com
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - **Name**: Stop Being Emotionally Reactive
   - **Primary Language**: English
   - **Bundle ID**: select the one matching your Xcode project
   - **SKU**: something like `emotionally-reactive-v1`
4. Click **Create**

### 5b. Fill in the App Store details

You'll need:
- **Screenshots**: take them on your phone (at least 3). You need screenshots for 6.7" (iPhone 15 Pro Max) and 6.5" (iPhone 11 Pro Max) sizes at minimum
- **Description**: write what the app does (you have plenty of copy from the workbook)
- **Keywords**: emotional reactivity, self-help, journaling, mental health, workbook, triggers, mindfulness
- **Category**: Health & Fitness or Lifestyle
- **Privacy Policy URL**: you need one (a simple page on your website explaining you store email/password via Supabase and journal entries in the cloud)

### 5c. Upload the build

In Xcode:

1. Change the device dropdown from your phone to **"Any iOS Device (arm64)"**
2. Go to **Product → Archive** in the menu bar
3. Wait for it to finish (a few minutes)
4. A window appears. Click **"Distribute App"**
5. Select **"App Store Connect"** → **"Upload"**
6. Follow the prompts, clicking Next/Upload
7. Wait about 15 minutes for Apple to process it

### 5d. Submit for review

Back in App Store Connect:
1. Under your app, click the **Build** section
2. Select the build you just uploaded
3. Fill in any remaining required fields
4. Click **"Submit for Review"**

Apple's review takes 1-3 days. They may ask you to make changes — this is normal, especially on a first submission. Common reasons: missing privacy policy, screenshots not matching the app, or missing a required description field.

---

## Updating the App Later

Whenever you update the web code:

```bash
npm run build:ios
npm run open:ios
```

Then in Xcode: bump the version number in Project Settings → General, archive, and upload again.

For the web version (Netlify), just `git push` as usual — the web and iOS deployments are independent.

---

## Common Issues

**"No signing certificate" error in Xcode**: You need to be enrolled in the Apple Developer Program ($99/year). Free accounts can only run on your own phone, not submit to the App Store.

**App crashes on launch**: Make sure your `.env` file has the correct Supabase credentials before running `npm run build:ios`.

**Fonts look different on iOS**: The Google Fonts are loaded from the web, so the phone needs an internet connection on first launch to cache them. After that they work offline.

**Keyboard covers the text areas**: The current CSS handles this in most cases. If you notice issues, add `"keyboard": { "resize": "ionic" }` to the `plugins` section of `capacitor.config.ts`.
