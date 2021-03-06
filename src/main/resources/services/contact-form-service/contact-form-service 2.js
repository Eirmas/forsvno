const libs = {
    portal: require("/lib/xp/portal"),
    mailLib: require('/lib/xp/mail')
};

exports.post = (req) => {
    let form = JSON.parse(req.body).data;
    let body = "";
    for (const key in form) {
        body += form[key] + "<br>"
    }
    log.info(form)
    var status = libs.mailLib.send({
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