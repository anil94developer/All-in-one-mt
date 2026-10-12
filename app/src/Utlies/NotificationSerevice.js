import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {useEffect} from 'react';


  // useEffect(() => {
  //   requestUserPermission();
  //   NotificationListner();
  // }, [props]);

  // messaging()
  // .getInitialNotification()
  // .then(remoteMessage => {
  //   if (remoteMessage) {
  //     console.log(
  //       'Notification caused app to open from quit state:',
  //         remoteMessage.notification,
  //     );
  //   }
  // });

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    }
  }

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log(fcmToken, 'fcm token');
  };

  const NotificationListner = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      notificationBuilder(remoteMessage);
      console.log(
        'Notificationn caused app to open from background state:',
        remoteMessage.notification,
      );
    });
    messaging().setBackgroundMessageHandler(function (payload) {
      console.log('Handling background message ', payload);
      // notificationBuilder(remoteMessage)
    });
    messaging().onMessage(async remoteMessage => {
      console.log('recieved in foreground', remoteMessage);
      notificationBuilder(remoteMessage);
      //   PushNotification.localNotification({
      //     message: remoteMessage.notification.body,
      //     title: remoteMessage.notification.title,
      // });
    });

    //   const notificationBuilder = remoteMessage => {
    //     PushNotification.createChannel(
    //       {
    //         channelId: 'specialid', // (required)
    //         channelName: remoteMessage.notification.title, // (required)
    //         channelDescription: remoteMessage.notification.body, // (optional) default: undefined.
    //         importance: 1, // (optional) default: 4. Int value of the Android notification importance
    //         vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    //       },
    //       created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    //     );
    //     PushNotification.localNotification({
    //       channelId: 'specialid', //his must be same with channelid in createchannel
    //       title: remoteMessage.notification.title,
    //       message: remoteMessage.notification.body,
    //     });
    //   };
    // };
    const notificationBuilder = remoteMessage => {
      PushNotification.createChannel(
        {
          channelId: 'washer', // (required)
          channelName: remoteMessage.notification.title, // (required)
          channelDescription: remoteMessage.notification.body, // (optional) default: undefined.
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
      PushNotification.localNotification({
        channelId: 'Manu', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        ticker: remoteMessage.notification.title, // (optional)
        showWhen: true, // (optional) default: true
        autoCancel: true, // (optional) default: true
        largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
        largeIconUrl: 'https://www.example.tld/picture.jpg', // (optional) default: undefined
        smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
        bigText: remoteMessage.notification.body, // (optional) default: "message" prop
        subText: 'New Notification Received', // (optional) default: none
        bigPictureUrl: 'https://www.example.tld/picture.jpg', // (optional) default: undefined
        bigLargeIcon: 'ic_launcher', // (optional) default: undefined
        bigLargeIconUrl: 'https://www.example.tld/bigicon.jpg', // (optional) default: undefined
        color: 'red', // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        tag: 'some_tag', // (optional) add tag to message
        group: 'group', // (optional) add group to message
        groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: 'high', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with com.dieam.reactnativepushnotification.notification_foreground setting
        shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
        onlyAlertOnce: true, // (optional) alert will open only once with sound and notify, default: false

        when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using showWhen, default: null.
        usesChronometer: false, // (optional) Show the when field as a stopwatch. Instead of presenting when as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
        timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

        messageId: 'google:message_id', // (optional) added as message_id to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

        // actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
        invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

        // / iOS only properties /
        category: '', // (optional) default: empty string
        // subtitle: "My Notification Subtitle", // (optional) smaller title below notification title

        // / iOS and Android properties /
        id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        title: remoteMessage.notification.title, // (optional)
        message: remoteMessage.notification.body, // (required)
        picture: 'https://www.example.tld/picture.jpg', // (optional) Display an picture with the notification, alias of bigPictureUrl for Android. default: undefined
        userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
      });
    };
  };

export  {requestUserPermission,NotificationListner};
// export {requestUserPermission,NotificationListner}
