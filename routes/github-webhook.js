var express = require('express');
var router = express.Router();
var crypto = require('crypto');

router.post('/', function(req, res, next){
    let signature = 'sha1=' + crypto.createHmac('sha1', global.botConfig.github_secret_key).update(JSON.stringify(req.body)).digest('hex');

    if (signature === req.headers['x-hub-signature']) {
        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear(),
                extendString = d.getHours() + ':' + d.getMinutes();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-')+ ' ' + extendString;
        }

        let eventValue = req.headers['x-github-event'];
        let message = 'Error: empty message';
        let data = req.body;

        if (eventValue === 'push') {
            message = "<b>Новое действие</b>: PUSH\n";
            message += "<b>Название репозитория:</b> " + data.repository.name + "\n";
            message += "<b>Ветка:</b> " + data.ref.split('/').pop() + "\n";
            message += "<b>Автор пуша:</b> " + data.pusher.name + "\n";
            message += "<b>Дата пуша:</b> " + formatDate(new Date()) + "";
            message += "\n\n***-***-***-***-***\n\n";

            // Commits
            for (var i in data.commits) {
                message += "<b>Автор коммита:</b> " + data.commits[i].author.name + "\n";
                message += "<b>Сообщение коммита:</b> " + data.commits[i].message + "\n\n";
                message += "<a href='" + data.commits[i].url + "'>Ссылка на коммит>></a>\n\n";
                message += "***-***-***-***-***\n\n";
            }
        }

        if (eventValue === 'create') {
            message = "<b>Новое действие</b>: CREATE\n"
            message += "<b>Автор:</b> " + data.sender.login + "\n";
            message += "<b>Название репозитория:</b> " + data.repository.full_name + "\n";
            message += "<b>Master Branch:</b> " + data.master_branch + "\n";
            message += "<b>Новая ветка:</b> " + data.ref + "\n";
            message += "<b>Дата:</b> " + formatDate(new Date()) + "\n";
        }

        if (eventValue === 'pull_request') {
            message = "<b>Новое действие</b>: PULL REQUEST\n"
            message += "<b>Автор:</b> " + data.pull_request.user.login + "\n";
            message += "<b>Сообщение:</b> " + data.pull_request.body + "\n";
            message += "<b>Статус:</b> " + data.action.toUpperCase() + "\n";
            message += "<b>Дата:</b> " + formatDate(new Date()) + "\n";
            message += "<a href='" +data.pull_request.html_url + "'>Ссылка >></a>";
        }

        if (eventValue === 'delete') {

        }

        if (eventValue === 'fork') {

        }

        if (eventValue === 'public') {

        }

        if (eventValue === 'member') {

        }

        if (eventValue === 'release') {

        }

        if (eventValue === 'status') {

        }

        telegramBot.sendMessage(botConfig.git_group_id, message, {
            parse_mode: 'html'
        });

    }

    res.end();
});

module.exports = router;