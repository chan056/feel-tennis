//邮件配置
var emailConfig = {
    senderEmail: {
        service: 'QQ',
        user: '374029208@qq.com',
        pass: 'btwnqqiqgvjybiid',
    }
 }
/**
 *
 * @Description 邮件发送 
 * 调用方法:sendMail('amor_zhang@qq.com','这是测试邮件', 'Hi Amor,这是一封测试邮件');
 *
 */

var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var config = emailConfig;// require('./config')

smtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.senderEmail.service,
    auth: {
        user: config.senderEmail.user,
        pass: config.senderEmail.pass
    }
}));

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, html) {

    smtpTransport.sendMail({

        from: config.senderEmail.user,
        to: recipient,
        subject: subject,
        html: html

    }, function (error, response) {
        if (error) {
            console.log(error);
        }
    });
    
}

sendMail('chenyi@zjcap.cn','这是测试邮件', 'Hi chenyi@zjcap.cn,这是一封测试邮件');

module.exports = sendMail;