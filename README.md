<div align="center">

<img src="https://files.catbox.moe/bk50vt.png" alt="sirobail" width="100%" />

<br/>
<br/>

# SiroBail RC13 

[![npm version](https://img.shields.io/npm/v/sirobail?color=CB3837&logo=npm&logoColor=white&style=for-the-badge)](https://www.npmjs.com/package/sirobail)
[![npm downloads](https://img.shields.io/npm/dm/sirobail?color=CB3837&logo=npm&logoColor=white&style=for-the-badge)](https://www.npmjs.com/package/sirobail)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org)
[![CommonJS](https://img.shields.io/badge/CommonJS-CJS-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge)](#)


**Open-source WhatsApp automation library · No browser required.**
Built on WebSocket for speed, stability, and full multi-device support.
<br/>

[Installation](#installation) · [Documentation](#sendmessage) · [Features](#features) · [Telegram](https://t.me/XyroSiro)

</div>

---

## What is sirobail?

**sirobail** is a powerful, open-source library for developers who need reliable WhatsApp automation without the overhead of a browser. Powered by **WebSocket technology**, it supports message management, group administration, interactive messages, and action buttons — all in a lightweight and modular package.

Actively maintained with continuous improvements to **pairing stability**, **session management**, and **WhatsApp multi-device compatibility**.

Perfect for:
- Business bots & chat automation
- Customer service systems
- Broadcast & notification tools
- E-commerce integrations

---

## Features

| Feature | Description |
|---|---|
| **Custom Pairing** | Stable pairing with your own codes — no disconnection issues |
| **Interactive Messages** | Buttons, menus, native flows, and more |
| **Rich Response** | AI-style messages with code blocks, tables, LaTeX, and maps |
| **Business Messaging** | Payment requests, product cards, and order messages |
| **Session Management** | Automatic, efficient, and long-term stable |
| **Multi-Device Support** | Fully compatible with WhatsApp's latest multi-device API |
| **Lightweight & Modular** | Easy to integrate into any Node.js project |
| **Rich Documentation** | Comprehensive guides and example code included |
| **Secure Auth** | Improved authentication flow with fixed prior vulnerabilities |

---

## Installation

```bash
npm install sirobail
```

> Requires **Node.js >= 20.0.0**

---

## Quick Start

```js
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('sirobail')

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  const sock = makeWASocket({ auth: state })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) setTimeout(start, 3000)
    } else if (connection === 'open') {
      console.log('✅ Connected')
    }
  })
}

start()
```

---

## Pairing Code

<details>
<summary><b>Random Pairing Code</b></summary>

```js
const code = await sock.requestPairingCode('628xxxxxxxxx')
console.log(code) // e.g. A1B2C3D4
```

</details>

<details>
<summary><b>Custom Pairing Code</b></summary>

Must be exactly 8 characters.

```js
const code = await sock.requestPairingCode('628xxxxxxxxx', 'MYBOT123')
```

</details>

---

## SendMessage

<details>
<summary><b>Text</b></summary>

```js
await sock.sendMessage(jid, { text: 'Hello!' })
```

</details>

<details>
<summary><b>Text with Mention</b></summary>

```js
await sock.sendMessage(jid, {
  text: '@628xxx hello!',
  mentions: ['628xxx@s.whatsapp.net']
})
```

</details>

<details>
<summary><b>Reply / Quote</b></summary>

```js
await sock.sendMessage(jid, { text: 'This is a reply!' }, { quoted: m })
```

</details>

<details>
<summary><b>Edit Message</b></summary>

```js
await sock.sendMessage(jid, {
  text: 'Edited message',
  edit: msg.key
})
```

</details>

<details>
<summary><b>Delete Message</b></summary>

```js
await sock.sendMessage(jid, { delete: msg.key })
```

</details>

<details>
<summary><b>Image</b></summary>

```js
await sock.sendMessage(jid, {
  image: { url: 'https://example.com/image.jpg' },
  caption: 'Caption'
})
```

</details>

<details>
<summary><b>Video</b></summary>

```js
await sock.sendMessage(jid, {
  video: { url: 'https://example.com/video.mp4' },
  caption: 'Caption'
})
```

</details>

<details>
<summary><b>Video Note (Circle / PTV)</b></summary>

```js
await sock.sendMessage(jid, {
  video: { url: 'https://example.com/video.mp4' },
  ptv: true
})
```

</details>

<details>
<summary><b>Audio / Voice Note</b></summary>

```js
// Regular audio
await sock.sendMessage(jid, {
  audio: { url: 'https://example.com/audio.mp3' },
  mimetype: 'audio/mp4'
})

// Voice note (PTT)
await sock.sendMessage(jid, {
  audio: { url: 'https://example.com/audio.ogg' },
  mimetype: 'audio/ogg; codecs=opus',
  ptt: true
})
```

</details>

<details>
<summary><b>Document</b></summary>

```js
await sock.sendMessage(jid, {
  document: { url: 'https://example.com/file.pdf' },
  mimetype: 'application/pdf',
  fileName: 'document.pdf'
})
```

</details>

<details>
<summary><b>Sticker</b></summary>

```js
await sock.sendMessage(jid, {
  sticker: { url: 'https://example.com/sticker.webp' }
})
```

</details>

<details>
<summary><b>Album (Multiple Images)</b></summary>

```js
await sock.sendMessage(jid, {
  albumMessage: [
    { image: { url: 'https://example.com/1.jpg' }, caption: 'First' },
    { image: { url: 'https://example.com/2.jpg' }, caption: 'Second' }
  ]
}, { quoted: m })
```

</details>

<details>
<summary><b>React</b></summary>

```js
await sock.sendMessage(jid, {
  react: { text: '👍', key: msg.key }
})

// Remove reaction
await sock.sendMessage(jid, {
  react: { text: '', key: msg.key }
})
```

</details>

<details>
<summary><b>Poll</b></summary>

```js
await sock.sendMessage(jid, {
  poll: {
    name: 'Which do you prefer?',
    values: ['Option A', 'Option B', 'Option C'],
    selectableCount: 1
  }
})
```

</details>

<details>
<summary><b>Poll Result</b></summary>

```js
await sock.sendMessage(jid, {
  pollResultMessage: {
    name: 'Poll Title',
    pollVotes: [
      { optionName: 'Option A', optionVoteCount: '42' },
      { optionName: 'Option B', optionVoteCount: '7' }
    ]
  }
}, { quoted: m })
```

</details>

<details>
<summary><b>Event</b></summary>

```js
await sock.sendMessage(jid, {
  eventMessage: {
    isCanceled: false,
    name: 'Event Name',
    description: 'Description here',
    location: { degreesLatitude: -6.2, degreesLongitude: 106.8, name: 'Jakarta' },
    joinLink: 'https://call.whatsapp.com/video/example',
    startTime: '1763019000',
    endTime: '1763026200',
    extraGuestsAllowed: true
  }
}, { quoted: m })
```

</details>

<details>
<summary><b>Location</b></summary>

```js
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: -6.2088,
    degreesLongitude: 106.8456,
    name: 'Monas, Jakarta'
  }
})
```

</details>

<details>
<summary><b>Contact / vCard</b></summary>

```js
const vcard =
  'BEGIN:VCARD\nVERSION:3.0\nFN:Contact Name\nTEL;type=CELL;type=VOICE;waid=628123456789:+62 812-3456-789\nEND:VCARD'

await sock.sendMessage(jid, {
  contacts: {
    displayName: 'Contact Name',
    contacts: [{ vcard }]
  }
})
```

</details>

<details>
<summary><b>Pin Message</b></summary>

```js
await sock.sendMessage(jid, {
  pin: msg.key,
  type: 1 // 1 = pin, 2 = unpin
})
```

</details>

<details>
<summary><b>Forward Message</b></summary>

```js
await sock.sendMessage(jid, {
  forward: msg,
  force: true
})
```

</details>

<details>
<summary><b>Status / Story</b></summary>

```js
await sock.sendMessage(jid, {
  groupStatusMessage: { text: 'Hello World' }
})
```

</details>

<details>
<summary><b>Group Story</b></summary>

```js
await sock.sendMessage(groupJid, {
  groupStatus: { text: 'Announcement for the group!' }
})
```

</details>

<details>
<summary><b>Group Member Label</b></summary>

Max 30 characters. Group only (`@g.us`).

```js
await sock.sendMessage(groupJid, {
  groupLabel: { labelText: '⭐ VIP Member' }
}, { quoted: m })
```

</details>

---

### Button & Interactive Messages

<details>
<summary><b>Button (Legacy)</b></summary>

```js
await sock.sendMessage(jid, {
  text: 'Choose one:',
  footer: 'sirobail',
  buttons: [
    { buttonId: 'btn1', buttonText: { displayText: '🔴 Option 1' }, type: 1 },
    { buttonId: 'btn2', buttonText: { displayText: '🟡 Option 2' }, type: 1 }
  ],
  headerType: 1
}, { quoted: m })
```

</details>

<details>
<summary><b>List Message</b></summary>

```js
await sock.sendMessage(jid, {
  text: 'Pick a menu:',
  footer: 'sirobail',
  title: 'Bot Menu',
  buttonText: 'Open Menu',
  sections: [
    {
      title: 'Main Features',
      rows: [
        { title: '📊 Status', description: 'Check bot status', rowId: 'status' },
        { title: '🏓 Ping', description: 'Check response time', rowId: 'ping' }
      ]
    }
  ]
}, { quoted: m })
```

</details>

<details>
<summary><b>Interactive Buttons</b></summary>

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    header: 'Header',
    title: 'Title',
    footer: 'Footer',
    buttons: [
      {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: 'Copy Code',
          id: '123456789',
          copy_code: 'SIROBAIL'
        })
      }
    ]
  }
}, { quoted: m })
```

</details>

<details>
<summary><b>Interactive + Native Flow</b></summary>

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    header: 'Menu',
    title: 'Bot',
    footer: 'sirobail',
    image: { url: 'https://example.com/image.jpg' },
    nativeFlowMessage: {
      messageParamsJson: JSON.stringify({
        bottom_sheet: { in_thread_buttons_limit: 2, list_title: 'Menu', button_title: 'Open' }
      }),
      buttons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: 'Select',
            sections: [
              {
                title: 'Options',
                rows: [
                  { title: 'Ping', description: 'Check status', id: 'ping' },
                  { title: 'Info', description: 'Bot info', id: 'info' }
                ]
              }
            ]
          })
        },
        {
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: 'Copy', id: '123', copy_code: 'SIROBAIL'
          })
        }
      ]
    }
  }
}, { quoted: m })
```

</details>

<details>
<summary><b>URL Button</b></summary>

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    header: 'Our Website',
    body: 'Visit our website for more info',
    footer: 'sirobail',
    nativeFlowMessage: {
      buttons: [
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: '🌐 Open Website',
            url: 'https://github.com/xyrosiro',
            merchant_url: 'https://github.com/xyrosiro'
          })
        }
      ]
    }
  }
}, { quoted: m })
```

</details>

<details>
<summary><b>Call Button</b></summary>

```js
await sock.sendMessage(jid, {
  interactiveMessage: {
    header: 'Contact Us',
    body: 'Need help? Call our support',
    footer: 'sirobail',
    nativeFlowMessage: {
      buttons: [
        {
          name: 'cta_call',
          buttonParamsJson: JSON.stringify({
            display_text: '📞 Call Support',
            phone_number: '+628123456789'
          })
        }
      ]
    }
  }
}, { quoted: m })
```

</details>

<details>
<summary><b>Handling Button Response</b></summary>

```js
sock.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0]
  if (!m.message) return

  // Legacy button response
  if (m.message.buttonsResponseMessage) {
    const id = m.message.buttonsResponseMessage.selectedButtonId
    console.log('Button pressed:', id)
  }

  // List response
  if (m.message.listResponseMessage) {
    const id = m.message.listResponseMessage.singleSelectReply.selectedRowId
    console.log('List selected:', id)
  }

  // Interactive / native flow response
  if (m.message.interactiveResponseMessage) {
    const nativeFlow = m.message.interactiveResponseMessage.nativeFlowResponseMessage
    if (nativeFlow) {
      const params = JSON.parse(nativeFlow.paramsJson || '{}')
      console.log('Native flow selected:', params.id || params.select_id)
    }
  }
})
```

</details>

---

### Rich Response

AI-style structured messages — text, code blocks, tables, LaTeX, maps, and images.

<details>
<summary><b>Markdown Text</b></summary>

```js
await sock.sendMessage(jid, {
  richResponse: {
    text: '**Hello!** This is a *rich message* from sirobail'
  }
})
```

</details>

<details>
<summary><b>Code Block</b></summary>

```js
await sock.sendMessage(jid, {
  richResponse: {
    text: 'Example JavaScript code:',
    code: `const greet = (name) => {
  console.log('Hello, ' + name)
}
greet('sirobail')`,
    language: 'javascript'
  }
})
```

</details>

<details>
<summary><b>Table</b></summary>

```js
await sock.sendMessage(jid, {
  richResponse: {
    text: 'Price list:',
    table: {
      rows: [
        ['Item', 'Price', 'Stock'],
        ['Item A', 'Rp 50.000', '10'],
        ['Item B', 'Rp 75.000', '5']
      ]
    }
  }
})
```

</details>

<details>
<summary><b>LaTeX Math</b></summary>

```js
await sock.sendMessage(jid, {
  richResponse: {
    text: 'Math formula:',
    latex: ['E = mc^2', 'a^2 + b^2 = c^2']
  }
})
```

</details>

<details>
<summary><b>Map</b></summary>

```js
await sock.sendMessage(jid, {
  richResponse: {
    text: 'Our store location:',
    map: {
      latitude: -6.2088,
      longitude: 106.8456,
      zoom: 15,
      title: 'Sirobail Store',
      annotations: [
        { latitude: -6.2088, longitude: 106.8456, title: 'Main Store' }
      ]
    }
  }
})
```

</details>

<details>
<summary><b>Inline Image</b></summary>

```js
await sock.sendMessage(jid, {
  richResponse: {
    text: 'Check this image:',
    imageUrl: 'https://example.com/image.jpg'
  }
})
```

</details>

<details>
<summary><b>Image Grid</b></summary>

```js
await sock.sendMessage(jid, {
  richResponse: {
    text: 'Product gallery:',
    imageUrls: [
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
      'https://example.com/img3.jpg'
    ]
  }
})
```

</details>

<details>
<summary><b>Combined (Text + Table + Code)</b></summary>

```js
await sock.sendMessage(jid, {
  richResponse: {
    botJid: '867051314767696@bot',
    text: '## Bot Report\nCurrent status:',
    table: {
      rows: [
        ['Metric', 'Value'],
        ['Uptime', '99.9%'],
        ['Response', '42ms']
      ]
    },
    code: 'console.log("sirobail active")',
    language: 'javascript'
  }
})
```

</details>

---

### Business Messaging

<details>
<summary><b>Payment Request</b></summary>

```js
await sock.sendMessage(jid, {
  requestPaymentMessage: {
    amount: 50000,        // in units of 1000 (50000 = Rp 50)
    currency: 'IDR',
    expiry: Date.now() + 86400000, // expires in 24h
    from: '628xxx@s.whatsapp.net',
    note: 'Payment for order #001'
  }
})
```

</details>

<details>
<summary><b>Product Message</b></summary>

```js
await sock.sendMessage(jid, {
  productMessage: {
    title: 'Product Name',
    description: 'Product description',
    thumbnail: { url: 'https://example.com/img.jpg' },
    productId: 'PROD001',
    retailerId: 'SKU-001',
    url: 'https://example.com/product',
    priceAmount1000: 50000,
    currencyCode: 'IDR',
    body: 'Body text',
    footer: 'Footer text'
  }
}, { quoted: m })
```

</details>

<details>
<summary><b>Order Message</b></summary>

```js
await sock.sendMessage(jid, {
  orderMessage: {
    orderTitle: 'Order #001',
    message: 'Thank you for your order',
    itemCount: 3,
    totalAmount1000: 150000,
    totalCurrencyCode: 'IDR'
  }
}, { quoted: m })
```

</details>

<details>
<summary><b>Product Catalog</b></summary>

```js
// Get catalog
const catalog = await sock.getCatalog({ jid: '628xxx@s.whatsapp.net' })

// Create product
await sock.productCreate({
  name: 'New Product',
  retailerId: 'SKU-002',
  price: 75000,
  currency: 'IDR',
  isHidden: false
})
```

</details>

---

## Group Management

<details>
<summary><b>Create Group</b></summary>

```js
const group = await sock.groupCreate(
  'Group Name',
  ['628xxx@s.whatsapp.net', '628yyy@s.whatsapp.net']
)
console.log('Group created:', group.id)
```

</details>

<details>
<summary><b>Group Metadata</b></summary>

```js
const metadata = await sock.groupMetadata('120363xxx@g.us')
console.log(metadata.subject)
console.log(metadata.participants)
```

</details>

<details>
<summary><b>Add / Remove Member</b></summary>

```js
await sock.groupParticipantsUpdate('120363xxx@g.us', ['628xxx@s.whatsapp.net'], 'add')
await sock.groupParticipantsUpdate('120363xxx@g.us', ['628xxx@s.whatsapp.net'], 'remove')
```

</details>

<details>
<summary><b>Promote / Demote Admin</b></summary>

```js
await sock.groupParticipantsUpdate('120363xxx@g.us', ['628xxx@s.whatsapp.net'], 'promote')
await sock.groupParticipantsUpdate('120363xxx@g.us', ['628xxx@s.whatsapp.net'], 'demote')
```

</details>

<details>
<summary><b>Update Group Name & Description</b></summary>

```js
await sock.groupUpdateSubject('120363xxx@g.us', 'New Group Name')
await sock.groupUpdateDescription('120363xxx@g.us', 'New description')
```

</details>

<details>
<summary><b>Group Settings</b></summary>

```js
await sock.groupSettingUpdate('120363xxx@g.us', 'announcement')     // only admins can chat
await sock.groupSettingUpdate('120363xxx@g.us', 'not_announcement') // everyone can chat
await sock.groupSettingUpdate('120363xxx@g.us', 'locked')           // only admins edit info
await sock.groupSettingUpdate('120363xxx@g.us', 'unlocked')         // everyone can edit info
```

</details>

<details>
<summary><b>Group Invite Link</b></summary>

```js
const link = await sock.groupInviteCode('120363xxx@g.us')
console.log('https://chat.whatsapp.com/' + link)

await sock.groupRevokeInvite('120363xxx@g.us')
const groupId = await sock.groupAcceptInvite('INVITECODE')
```

</details>

<details>
<summary><b>Leave Group</b></summary>

```js
await sock.groupLeave('120363xxx@g.us')
```

</details>

---

## Newsletter / Channel

<details>
<summary><b>Get Newsletter ID</b></summary>

```js
const id = await sock.newsletterId('https://whatsapp.com/channel/...')
```

</details>

<details>
<summary><b>Create Newsletter</b></summary>

```js
const channel = await sock.newsletterCreate('Channel Name', 'Channel description')
console.log(channel.id)
```

</details>

<details>
<summary><b>Follow / Unfollow / Mute</b></summary>

```js
await sock.newsletterFollow('120363xxx@newsletter')
await sock.newsletterUnfollow('120363xxx@newsletter')
await sock.newsletterMute('120363xxx@newsletter')
await sock.newsletterUnmute('120363xxx@newsletter')
```

</details>

<details>
<summary><b>Update Channel Info</b></summary>

```js
await sock.newsletterUpdateName('120363xxx@newsletter', 'New Channel Name')
await sock.newsletterUpdateDescription('120363xxx@newsletter', 'New description')
await sock.newsletterUpdatePicture('120363xxx@newsletter', fs.readFileSync('./photo.jpg'))
await sock.newsletterRemovePicture('120363xxx@newsletter')
```

</details>

<details>
<summary><b>Reaction Mode</b></summary>

```js
// 'ALL' | 'BASIC' | 'NONE'
await sock.newsletterReactionMode('120363xxx@newsletter', 'ALL')
```

</details>

<details>
<summary><b>Admin Management</b></summary>

```js
const adminCount = await sock.newsletterAdminCount('120363xxx@newsletter')
await sock.newsletterChangeOwner('120363xxx@newsletter', 'newowner@s.whatsapp.net')
await sock.newsletterDemote('120363xxx@newsletter', 'admin@s.whatsapp.net')
await sock.newsletterDelete('120363xxx@newsletter')
```

</details>

<details>
<summary><b>Check WhatsApp Number</b></summary>

```js
const result = await sock.checkWhatsApp('628xxx@s.whatsapp.net')
```

</details>

---

## Events

```js
// Incoming messages
sock.ev.on('messages.upsert', ({ messages, type }) => { })

// Message status updates (sent, read, etc.)
sock.ev.on('messages.update', updates => { })

// Connection updates
sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => { })

// Credentials update (must be saved)
sock.ev.on('creds.update', saveCreds)

// Group members changed
sock.ev.on('group-participants.update', ({ id, participants, action }) => { })

// Group metadata changed
sock.ev.on('groups.update', updates => { })

// Presence (typing, online, etc.)
sock.ev.on('presence.update', ({ id, presences }) => { })
```

---

## Changelog

**v2.2.5** *(latest)*
- Added `richResponse` — AI-style messages with code blocks, tables, LaTeX, and maps
- Added `requestPaymentMessage`, `productMessage`, `orderMessage` for business use cases
- Added `groupStatus` (group story) and `groupLabel` (member labels)
- Added 5 newsletter admin functions: `newsletterUpdateName`, `newsletterUpdateDescription`, `newsletterUpdatePicture`, `newsletterRemovePicture`, `newsletterReactionMode`
- Improved Album message reliability

---

## License

MIT © [xyrosiro](https://github.com/xyrosiro)