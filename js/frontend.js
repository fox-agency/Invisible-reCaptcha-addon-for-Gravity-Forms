var key = gfGoogleCaptchaScriptFrontend_strings.key

grecaptcha.ready(function() {
    for (var i = 0; i < document.forms.length; ++i) {
        var form = document.forms[i]

        var holder = form.querySelector('.gf-recaptcha-div')

        if (null === holder) continue
        holder.innerHTML = ''
        ;(function(frm) {
            // This sets everything up for the form call
            var holderId = grecaptcha.render(holder, {
                sitekey: key,
                size: 'invisible',
                badge: 'inline',
            })

            // Here the form is submitted, using everything from, above
            frm.addEventListener('submit', function(evt) {
                evt.preventDefault()
                // Execute and get token
                var action = form.id.replace(/[^a-zA-Z0-9_]/g, '_');
                grecaptcha
                    .execute(holderId, { action: action })
                    .then(function(token) {
                        // Take token and pass to server
                        tellServer(token, frm)
                    })
            })
        })(form)
    }
})

function tellServer(token, frm) {
    var data = {
        action: 'check_google_token_request',
        token: token,
        security: gfGoogleCaptchaScriptFrontend_strings.security,
    }

    axios
        .post(gfGoogleCaptchaScriptFrontend_strings.ajaxurl, Qs.stringify(data))
        .then(function(response) {
            if (response.data.success) {
                var recaptchaFields = document.querySelector(
                    '[data-type="recaptcha-score"]'
                )
                if (recaptchaFields) {
                    recaptchaFields.value = response.data.score
                }
                frm.submit()
            } else {
                console.log('Is a bot')
            }
        })
        .catch(function(error) {
            // handle error
            console.log(error)
        })
}
