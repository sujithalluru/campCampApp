/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const logger = require('firebase-functions/logger');

admin.initializeApp();

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
exports.sendGratitudeOnWrite = functions.firestore
    .document('gratitudeMessage/{gratitudeMessageId}')
    .onCreate((snap, context) => {
        const notification  = snap.data();

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

