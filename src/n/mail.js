/**
 *
 * @Description 邮件发送 
 * 调用方法:sendMail('amor_zhang@qq.com','这是测试邮件', 'Hi Amor,这是一封测试邮件');
 *
 */

var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var emailSender = require('./constant').emailSender;// require('./config')

smtpTransport = nodemailer.createTransport(smtpTransport({
    service: emailSender.service,
    auth: {
        user: emailSender.user,
        pass: emailSender.pass
    }
}));

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, html) {

    smtpTransport.sendMail({

        from: emailSender.user,
        to: recipient,
        subject: subject,
        html: html

    }, function (error, response) {
        if (error) {
            console.log(error);
        }
    });
    
}

module.exports.sendMail = sendMail;