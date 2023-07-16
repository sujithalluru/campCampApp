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
	refreshToken: '1//04K7-64kP6NrYCgYIARAAGAQSNwF-L9IrGBi8BZFeEu0qeahzeoI_uPWQOsz4i_c1vA4nXF65UMYyd7RpTUMnTUElWJ2ZGSIakcw'
    },
});

exports.sendAppleNotificationOnWrite = functions.firestore
    .document('notifications/{notificationId}')
    .onCreate((snap, context) => {
        const notification = snap.data();

        const message = {
            notification: {
                title: notification.title,  // getting title from the document
                body: notification.body,  // getting body from the document
            },
            topic: 'allios',
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
exports.sendAndroidNotificationOnWrite = functions.firestore
    .document('notifications/{notificationId}')
    .onCreate((snap, context) => {
        const notification = snap.data();

        const message = {
            data: {
                title: notification.title,  // getting title from the document
                body: notification.body,  // getting body from the document
            },
            topic: 'allandroid',
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
exports.sendVolAppleNotifOnWrite = functions.firestore
    .document('volnotifications/{notificationId}')
    .onCreate((snap, context) => {
        const notification  = snap.data();

        const message = {
            notification: {
                title: notification.title,  // getting title from the document
                body: notification.body,  // getting body from the document
            },
            topic: 'volunteerios',
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
exports.sendVolAndroidNotifOnWrite = functions.firestore
    .document('volnotifications/{notificationId}')
    .onCreate((snap, context) => {
        const notification = snap.data();

        const message = {
            data: {
                title: notification.title,  // getting title from the document
                body: notification.body,  // getting body from the document
            },
            topic: 'volunteerandroid',
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

exports.sendCodes = functions.https.onCall(async (data, context) => {
  let volunteerCode = Math.floor(100000 + Math.random() * 900000); // generate 6-digit code
  let adminCode = Math.floor(100000 + Math.random() * 900000); // generate 6-digit code

  // Send email
  let info = await transporter.sendMail({
    from: '"Your App" <sujith.alluru1108@gmail.com>',
    to: "campcampappdev@gmail.com",
    subject: "Weekly Codes",
    text: `Volunteer code: ${volunteerCode}\nAdmin code: ${adminCode}`,
    html: `<b>Volunteer code: ${volunteerCode}</b><br/><b>Admin code: ${adminCode}</b>`
  });

  // Save codes to database
  let db = admin.firestore();
  let docRef = db.collection('codes').doc('current');
  await docRef.set({
    volunteer: volunteerCode,
    admin: adminCode
  });
  const tokensSnapshot = await admin.firestore().collection('tokens').where('topic', '==', 'volunteer').get();

  // Unsubscribe each token from the topic and delete the token from Firestore
  const unsubscribePromises = [];
  for (const doc of tokensSnapshot.docs) {
    unsubscribePromises.push(admin.messaging().unsubscribeFromTopic(doc.id, 'volunteerios'));
    unsubscribePromises.push(admin.messaging().unsubscribeFromTopic(doc.id, 'volunteerandroid'));
    unsubscribePromises.push(doc.ref.delete());
  }

  await Promise.all(unsubscribePromises);
  return { result: 'Codes sent and devices unsubscribed from topic.' };
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
