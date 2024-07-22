/**
 * Script for loginCracked.ejs
 */
// Validation Regexes.
const validUsernameCracked         = /^[a-zA-Z0-9_]{1,16}$/
const basicEmailCracked            = /^\S+@\S+\.\S+$/
//const validEmail          = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

// Login Elements
const loginCancelContainerCracked  = document.getElementById('loginCancelContainerCracked')
const loginCancelButtonCracked     = document.getElementById('loginCancelButtonCracked')
const loginEmailErrorCracked       = document.getElementById('loginEmailErrorCracked')
const loginUsernameCracked         = document.getElementById('loginUsernameCracked')
const loginPasswordErrorCracked    = document.getElementById('loginPasswordErrorCracked')
const loginPasswordCracked         = document.getElementById('loginPasswordCracked')
const checkmarkContainerCracked    = document.getElementById('checkmarkContainerCracked')
const loginRememberOptionCracked   = document.getElementById('loginRememberOptionCracked')
const loginButtonCracked           = document.getElementById('loginButtonCracked')
const loginFormCracked             = document.getElementById('loginFormCracked')

// Control variables.
let luCracked = false, lpCracked = false


/**
 * Show a login error.
 *
 * @param {HTMLElement} element The element on which to display the error.
 * @param {string} value The error text.
 */
function showErrorCracked(element, value){
    element.innerHTML = value
    element.style.opacity = 1
}

/**
 * Shake a login error to add emphasis.
 *
 * @param {HTMLElement} element The element to shake.
 */
function shakeErrorCracked(element){
    if(element.style.opacity == 1){
        element.classList.remove('shake')
        void element.offsetWidth
        element.classList.add('shake')
    }
}

/**
 * Validate that an email field is neither empty nor invalid.
 *
 * @param {string} value The email value.
 */
function validateEmailCracked(value){
    if(value){
        if(!basicEmailCracked.test(value) && !validUsernameCracked.test(value)){
            showErrorCracked(loginEmailErrorCracked, Lang.queryJS('loginCracked.error.invalidValue'))
            loginDisabledCracked(true)
            luCracked = false
        } else {
            loginEmailErrorCracked.style.opacity = 0
            luCracked = true
            if(lpCracked){
                loginDisabledCracked(false)
            }
        }
    } else {
        luCracked = false
        showErrorCracked(loginEmailErrorCracked, Lang.queryJS('loginCracked.error.requiredValue'))
        loginDisabledCracked(true)
    }
}

/**
 * Validate that the password field is not empty.
 *
 * @param {string} value The password value.
 */
function validatePasswordCracked(value){
    if(value){
        loginPasswordErrorCracked.style.opacity = 0
        lpCracked = true
        if(luCracked){
            loginDisabledCracked(false)
        }
    } else {
        lpCracked = false
        showErrorCracked(loginPasswordErrorCracked, Lang.queryJS('loginCracked.error.invalidValue'))
        loginDisabledCracked(true)
    }
}

// Emphasize errors with shake when focus is lost.
loginUsernameCracked.addEventListener('focusout', (e) => {
    validateEmailCracked(e.target.value)
    shakeErrorCracked(loginEmailErrorCracked)
})
loginPasswordCracked.addEventListener('focusout', (e) => {
    validatePasswordCracked(e.target.value)
    shakeErrorCracked(loginPasswordErrorCracked)
})

// Validate input for each field.
loginUsernameCracked.addEventListener('input', (e) => {
    validateEmailCracked(e.target.value)
})
loginPasswordCracked.addEventListener('input', (e) => {
    validatePasswordCracked(e.target.value)
})

/**
 * Enable or disable the login button.
 *
 * @param {boolean} v True to enable, false to disable.
 */
function loginDisabledCracked(v){
    if(loginButtonCracked.disabled !== v){
        loginButtonCracked.disabled = v
    }
}

/**
 * Enable or disable loading elements.
 *
 * @param {boolean} v True to enable, false to disable.
 */
function loginLoadingCracked(v){
    if(v){
        loginButtonCracked.setAttribute('loading', v)
        loginButtonCracked.innerHTML = loginButtonCracked.innerHTML.replace(Lang.queryJS('loginCracked.login'), Lang.queryJS('loginCracked.loggingIn'))
    } else {
        loginButtonCracked.removeAttribute('loading')
        loginButtonCracked.innerHTML = loginButtonCracked.innerHTML.replace(Lang.queryJS('loginCracked.loggingIn'), Lang.queryJS('loginCracked.login'))
    }
}

/**
 * Enable or disable login form.
 *
 * @param {boolean} v True to enable, false to disable.
 */
function formDisabledCracked(v){
    loginDisabledCracked(v)
    loginCancelButtonCracked.disabled = v
    loginUsernameCracked.disabled = v
    loginPasswordCracked.disabled = v
    if(v){
        checkmarkContainerCracked.setAttribute('disabled', v)
    } else {
        checkmarkContainerCracked.removeAttribute('disabled')
    }
    loginRememberOptionCracked.disabled = v
}

let loginViewOnSuccessCracked = VIEWS.landing
let loginViewOnCancelCracked = VIEWS.settings
let loginViewCancelHandlerCracked

function loginCancelEnabledCracked(val){
    if(val){
        $(loginCancelContainerCracked).show()
    } else {
        $(loginCancelContainerCracked).hide()
    }
}

loginCancelButtonCracked.onclick = (e) => {
    switchView(getCurrentView(), loginViewOnCancelCracked, 500, 500, () => {
        loginUsernameCracked.value = ''
        loginPasswordCracked.value = ''
        loginCancelEnabledCracked(false)
        if(loginViewCancelHandlerCracked != null){
            loginViewCancelHandlerCracked()
            loginViewCancelHandlerCracked = null
        }
    })
}

// Disable default form behavior.
loginFormCracked.onsubmit = () => { return false }

// Bind login button behavior.
loginButtonCracked.addEventListener('click', () => {
    // Disable form.
    formDisabledCracked(true)

    // Show loading stuff.
    loginLoadingCracked(true)

    AuthManager.addCrackedAccount(loginUsernameCracked.value, loginPasswordCracked.value).then((value) => {
        updateSelectedAccount(value)
        loginButtonCracked.innerHTML = loginButtonCracked.innerHTML.replace(Lang.queryJS('loginCracked.loggingIn'), Lang.queryJS('loginCracked.success'))
        $('.circle-loader').toggleClass('load-complete')
        $('.checkmark').toggle()
        setTimeout(() => {
            switchView(VIEWS.loginCracked, loginViewOnSuccessCracked, 500, 500, async () => {
                // Temporary workaround
                if(loginViewOnSuccessCracked === VIEWS.settings){
                    await prepareSettings()
                }
                loginViewOnSuccessCracked = VIEWS.landing // Reset this for good measure.
                loginCancelEnabledCracked(false) // Reset this for good measure.
                loginViewCancelHandlerCracked = null // Reset this for good measure.
                loginUsernameCracked.value = ''
                loginPasswordCracked.value = ''
                $('.circle-loader').toggleClass('load-complete')
                $('.checkmark').toggle()
                loginLoadingCracked(false)
                loginButtonCracked.innerHTML = loginButtonCracked.innerHTML.replace(Lang.queryJS('loginCracked.success'), Lang.queryJS('loginCracked.login'))
                formDisabledCracked(false)
            })
        }, 1000)
    }).catch((displayableError) => {
        loginLoadingCracked(false)

        let actualDisplayableError
        if(isDisplayableError(displayableError)) {
            msftLoginLogger.error('Error while logging in.', displayableError)
            actualDisplayableError = displayableError
        } else {
            // Uh oh.
            msftLoginLogger.error('Unhandled error during loginCracked.', displayableError)
            actualDisplayableError = Lang.queryJS('loginCracked.error.unknown')
        }

        setOverlayContent(actualDisplayableError.title, actualDisplayableError.desc, Lang.queryJS('loginCracked.tryAgain'))
        setOverlayHandler(() => {
            formDisabledCracked(false)
            toggleOverlay(false)
        })
        toggleOverlay(true)
    })

})