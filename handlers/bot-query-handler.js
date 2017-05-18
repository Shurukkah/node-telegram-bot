var botApiHandler = new Object();

checkPermissions = function (userId) {
    var access = false;

    for (var i in global.botConfig.administrators)
        if (global.botConfig.administrators[i].id === userId) {
            access = true;
            break;
        }

    return access;
};

botApiHandler.start = function () {
    global.telegramBot.on('message', function (message) {
        if (message.text && message.text.toLowerCase() === '/get_chat_id' && checkPermissions(message.from.id)) {
            //console.log(message);
            global.telegramBot.sendMessage(message.chat.id, 'CHAT ID: ' + message.chat.id);
            return;
        }
    });
}

module.exports = botApiHandler;
