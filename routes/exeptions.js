var express = require('express');
var router = express.Router();
var md5 = require('md5');
var fs = require('fs');

function countOfOject(obj) {
    var t = typeof(obj);
    var i=0;
    if (t!="object" || obj==null) return 0;
    for (x in obj) i++;
    return i;
}

/* GET home page. */
router.all('/', function(req, res, next) {
    var requestVariables = (countOfOject(req.query) > 0)? req.query : req.body;

    if (requestVariables.key && requestVariables.key.trim() === global.botConfig.post_query_secret) {
        var chatId = requestVariables.chat_id;
        
        chatId = requestVariables.chat_id;
        var users = requestVariables.user;
        var errorMessage = requestVariables.error_message;
        var usersText = new String();

        for (var i in users)
            usersText += '@' + users[i] + ' ';

        var resultText = errorMessage + "\n\n" + usersText;

        var md5Logname = (errorMessage)? md5(errorMessage) : new String();
        fs.exists(__dirname + '/../logs/' + md5Logname, function (exists) {
            if (exists) {
                global.telegramBot.sendMessage(chatId, "<b>Повторное EXCEPTION-уведомление:</b>\n\n" + resultText, {parse_mode: 'HTML'});
            } else {
                global.telegramBot.sendMessage(chatId, "<b>Новое EXCEPTION-уведомление:</b>\n\n" + resultText, {parse_mode: 'HTML'});
                fs.writeFile(__dirname + '/../logs/' + md5Logname, '', function(error){
                    if (error)
                        return console.log(error);
                });
            }
        });
    }

    res.end('');
});

module.exports = router;