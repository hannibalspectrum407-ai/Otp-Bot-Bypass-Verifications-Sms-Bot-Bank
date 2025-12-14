module.exports = function(request, response) {
    /**
     * Intégration des dépendences SQLITE3
     */
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('./db/data.db');

    /**
     * Dépendance permettant la génération du mot de passe de l'api
     */
    const fs = require('fs');
    const generator = require('generate-password');

    /**
     * Création de la DB ainsi que les tables contenues dedans
     */
    db.serialize(function() {
        db.run('CREATE TABLE IF NOT EXISTS calls (itsfrom TEXT, itsto TEXT, digits TEXT, callSid TEXT, status TEXT, date TEXT, user TEXT, name TEXT, service TEXT)');
        db.run('CREATE TABLE IF NOT EXISTS sms (itsfrom TEXT, itsto TEXT, smssid TEXT, content TEXT, status TEXT, date TEXT, user TEXT, service TEXT)');
    });

    var pass = generator.generate({
        length: 32,
        numbers: true
    });

    // Write .env file for API where developers can set secrets. This avoids patching config.js at runtime.
    var envContents = '';
    envContents += 'TWILIO_ACCOUNT_SID=' + (process.env.TWILIO_ACCOUNT_SID || '') + "\n";
    envContents += 'TWILIO_AUTH_TOKEN=' + (process.env.TWILIO_AUTH_TOKEN || '') + "\n";
    envContents += 'TWILIO_CALLERID=' + (process.env.TWILIO_CALLERID || '+yourcallerid') + "\n";
    envContents += 'API_PASSWORD=' + pass + "\n";
    envContents += 'SERVER_URL=' + (process.env.SERVER_URL || 'http://yourserverip:1337') + "\n";
    envContents += 'DISCORD_WEBHOOK=' + (process.env.DISCORD_WEBHOOK || '') + "\n";
    envContents += 'SETUPDONE=true\n';

    fs.writeFile('.env', envContents, 'utf-8', function(err, data) {
        if (err) throw err;
        console.log('Setup the new .env file with an API password : done.');
    });
};