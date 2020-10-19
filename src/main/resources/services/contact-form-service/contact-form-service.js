const libs = {
    portal: require("/lib/xp/portal"),
    mail: require('/lib/xp/mail'),
    node: require('/lib/xp/node'),
    repo: require('/lib/xp/repo'),
    httpClient: require('/lib/http-client')
};

exports.post = (req) => {
    const form = req.params;
    let body = "";

    for (const key in form) {
        body += `${form[key]}<br>`;
    }
    
    const recaptcha = verify(form.token);

    const storage = create(form.receiver.split("@").shift(), body);

    const mail = send(form.receiver, body);
    log.info(JSON.stringify(recaptcha));
    log.info(JSON.stringify(storage));
    log.info(JSON.stringify(mail));
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
        secret: "6LdRatYZAAAAAFkR8lRxCTl8S055MANTjCKP39HS",
        response: token
    }
    const result = libs.httpClient.request({
        url: 'https://www.google.com/recaptcha/api/siteverify',
        method: "POST",
        params: recaptcha
    });
    log.info(JSON.stringify(result));
    return result.body.success || false
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
function create(repoId, data) {
    if(!libs.repo.get(repoId)) {
        createRepo(repoId)
    }
    try {
        var repo = libs.node.connect({
            repoId: repoId,
            branch: "master"
        });
        var result = repo.create({
            data: data,
        });
        log.info('Content created with id ' + result._id);
        
    } catch (e) {
        log.error('Unexpected error: ' + e.message);
        return false;
    }
    return true;
}

function createRepo(id) {
    var result = libs.repo.create({
        id: id
    });
    log.info('Repository created with id ' + result.id);    
}
