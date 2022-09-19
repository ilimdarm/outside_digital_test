export const validatePass = (pass) => {
    if (pass.length < 8 || pass === pass.replace(/\d/, '') || pass === pass.replace(/[a-zA-Zа-яА-Я]/, '') || pass === pass.replace(/\W/, '') || pass.length > 100)
        return false
    return true
}

export const validateEmail = (email) => {
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
    var valid = emailRegex.test(email);
    if(!valid || email.length > 100)
        return false
    return true
}

export const validateNickname = (nickname) => {
    if(nickname.length > 30)
        return false
    return true
}
