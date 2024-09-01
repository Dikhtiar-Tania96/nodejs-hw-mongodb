import {nodemailer} from 'nodemailer';

const transport = nodemailer.createTransport({

});


export function sendMail (message){
    return transport.sendMail(message);
}