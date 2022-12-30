import sgMail from '@sendgrid/mail'
const sendGrid_API_Key = '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'

sgMail.setApiKey(sendGrid_API_Key)

const sendWelcomeEmail = (Email , name) => {
    sgMail.send({
        to: Email,
        from: 'jenil.avs123@gmail.com',
        subject: 'Thanks for joining in!',
        text: `welcome to the app ${name}`
    })
}

const sendCancelationEmail = (Email , name) => {
    sgMail.send({
        to: Email,
        from: 'jenil.avs123@gmail.com',
        subject: 'Sorry ,to see you go!',
        text: `Goodby , ${name}`
    })
}

export default {sendWelcomeEmail} 