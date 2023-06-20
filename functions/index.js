const functions = require('firebase-functions');
const admin = require('firebase-admin');
const logger = require('firebase-functions/logger');
const nodemailer = require('nodemailer');

admin.initializeApp();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'sujith.alluru1108@gmail.com',
        clientId: '580880783847-57v1bstle9k77nbsacaouvg8ijqlm7tq.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04VjnmDILjO3bCgYIARAAGAQSNwF-L9Irq10dAp_eXqh9JLMYOXSi6j8cSsjf70wNPLabmaL3-W8JLBqvjeJ5v5NwSTOATxvYnJY',
    },
});

exports.sendNotificationOnWrite = functions.firestore
    .document('notifications/{notificationId}')
    .onCreate((snap, context) => {
        const notification = snap.data();

        const message = {
            notification: {
                title: notification.title,  // getting title from the document
                body: notification.body,  // getting body from the document
            },
            topic: 'all',
        };

        // Send a message to devices subscribed to the provided topic.
        return admin.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                logger.info('Successfully sent message:', response);
            })
            .catch((error) => {
                logger.error('Error sending message:', error);
            });
    });
exports.sendvolNotifOnWrite = functions.firestore
    .document('volnotifications/{notificationId}')
    .onCreate((snap, context) => {
        const notification  = snap.data();

        const message = {
            notification: {
                title: notification.title,  // getting title from the document
                body: notification.body,  // getting body from the document
            },
            topic: 'volunteer',
        };

        // Send a message to devices subscribed to the provided topic.
        return admin.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                logger.info('Successfully sent message:', response);
            })
            .catch((error) => {
                logger.error('Error sending message:', error);
            });
    });

exports.sendCodes = functions.pubsub.schedule('every day 00:00').onRun(async (context) => {
  let volunteerCode = Math.floor(100000 + Math.random() * 900000); // generate 6-digit code
  let adminCode = Math.floor(100000 + Math.random() * 900000); // generate 6-digit code

  // Send email
  let info = await transporter.sendMail({
    from: '"Your App" <sujith.alluru1108@gmail.com>',
    to: "sujith.alluru1108@gmail.com",
    subject: "Weekly Codes",
    text: `Volunteer code: ${volunteerCode}\nAdmin code: ${adminCode}`,
    html: `<b>Volunteer code: ${volunteerCode}</b><br/><b>Admin code: ${adminCode}</b>`
  });

  // Save codes to database
  let db = admin.firestore();
  let docRef = db.collection('codes').doc('current');
  return docRef.set({
    volunteer: volunteerCode,
    admin: adminCode
  });
});

exports.validateCode = functions.https.onCall(async (data, context) => {
  let db = admin.firestore();
  let docRef = db.collection('codes').doc('current');
  let doc = await docRef.get();

  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'No current codes');
  }

  let codes = doc.data();
  if (codes[data.role] !== data.code) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid code');
  }

  return { valid: true };
});
