const libs = {
    portal: require("/lib/xp/portal"),
    mail: require('/lib/xp/mail'),
    node: require('/lib/xp/node'),
    repo: require('/lib/xp/repo'),
    httpClient: require('/lib/http-client'),
    value: require('/lib/xp/value')
};

exports.post = (req) => {
    const form = req.params;
    let body = "";

    for (const key in form) {
        body += `${key}: ${form[key]}<br>`;
    }

    const recaptcha = verify(form.token);

    const storage = create(form.receiver.split("@").shift(), form);

    const mail = send(form.receiver, body);

    return {
        status: recaptcha && storage && mail ? 200 : 500,
        message: recaptcha && storage && mail ? "ok" : "error"
    }    
}
/**
 *  Recaptcha - Sends the recaptcha token to Google for verification 
 */
function verify(token) {
    log.info(token);
    const recaptcha = {
        secret: libs.portal.getSiteConfig().secretKey,
        response: token
    }
    const result = libs.httpClient.request({
        url: 'https://www.google.com/recaptcha/api/siteverify',
        method: "POST",
        params: recaptcha
    });
    return JSON.parse(result.body).success || false
}
/**
 * Mail - Sends the data to the user via email 
 */
function send(receiver, body) {
    return libs.mail.send({
        from: '0bb92d4b2d-fdec2c@inbox.mailtrap.io',
        to: receiver,
        subject: 'Test subject',
        body: body,
        contentType: 'text/html; charset="UTF-8"'
    });
}
/** 
 * Storage - Stores the data in the Enonic XP node database
 */
function create(receiver, data, attachments) {
    if(!libs.repo.get("contact-forms")) {
        createRepo("contact-forms")
    }
    try {
        const repo = libs.node.connect({
            repoId: "contact-forms",
            branch: "master"
        });
        if(!repo.get(`/${receiver}`)) {
            repo.create({ _name: receiver });
        }
        const keys = Object.keys(data).filter((key) => key.startsWith("Attachment"))
        let attachments = [];
        for (const file of keys) {
            const stream = libs.portal.getMultipartStream(`${file}-stream`);
            attachments.push({ name: file, mime: data[file], stream: libs.value.binary(file.replace("@", "."), stream) })
        }
        const result = repo.create({
            _parentPath: `/${receiver}`,
            data: data,
            attachments: attachments
        });        
        
    } catch (e) {
        log.error('Unexpected error: ' + e);
        return false;
    }
    return true;
}
/**
 * Creates new repository with id if nonexistent
 */
function createRepo(id) {
    var result = libs.repo.create({
        id: id
    });
    log.info('Repository created with id ' + result.id);    
}
