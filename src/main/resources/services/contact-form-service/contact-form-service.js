const libs = {
    portal: require("/lib/xp/portal"),
    mailLib: require('/lib/xp/mail')
};

exports.post = (req) => {
<<<<<<< HEAD
    let form = JSON.parse(req.body).data;
    let body = "";
    for (const key in form) {
        body += form[key] + "<br>"
    }
    log.info(form)
    var status = libs.mailLib.send({
=======
    const form = JSON.parse(req.body).data;
    const body = "";
    for (const key in form) {
        body += `${form[key]}<br>`;
    }
    const status = libs.mailLib.send({
>>>>>>> c8b02a60a71e37b0cf1059d110e8759d7c739485
        from: 'me@enonic.com',
        to: form.contact_email,
        subject: 'Test subject',
        body: body,
        contentType: 'text/html; charset="UTF-8"'
    });
    return {
        mail_sent: status
    }
}