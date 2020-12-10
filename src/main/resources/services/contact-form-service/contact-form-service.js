const libs = {
  portal: require("/lib/xp/portal"),
  mail: require('/lib/xp/mail'),
  node: require('/lib/xp/node'),
  repo: require('/lib/xp/repo'),
  httpClient: require('/lib/http-client'),
  value: require('/lib/xp/value'),
  thymeleaf: require('/lib/thymeleaf')
};

exports.post = (req) => {
    const form = req.params;

    const recaptcha = verify(form.token);

    const storage = create(form.receiver.split("@").shift(), form);

    const mail = send(form.receiver, form);

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
function send(receiver, data) {
  let fields = [];
  for (const key in data) {
    if (key.startsWith("contact-form")) fields.push(JSON.parse(data[key]));
  }
  const view = resolve('template.html');
  log.info(JSON.stringify(data));
  const body = libs.thymeleaf.render(view, { fields: fields });
  return libs.mail.send({
    from: 'autkilen@fms.mil.no',
    to: receiver,
    subject: 'Test subject',
    body: body,
    contentType: 'text/html; charset="UTF-8"'
  });
}
/** 
 * Storage - Stores the data in the Enonic XP node database
 */
function create(receiver, data) {
  if (!libs.repo.get("contact-forms")) {
    createRepo("contact-forms")
  }
  try {
    const repo = libs.node.connect({
      repoId: "contact-forms",
      branch: "master"
    });
    if (!repo.get(`/${receiver}`)) {
      repo.create({ _name: receiver });
    }
    const keys = Object.keys(data).filter((key) => key.startsWith("attachment"))
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