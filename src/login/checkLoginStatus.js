function CheckStatus(security) {
    
    function clearCookiesAndStorage() {
            let storage = window.localStorage;
            storage.removeItem('eventualUser');
            storage.removeItem('eventualRelease');
            document.cookie = "eventualUser=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "eventualRelease=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            location.reload()
        }

    function getCookie(name) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; ++i) {
            var pair = cookies[i].trim().split('=');
            if (pair[0] === name) {
                return (pair[1]);
            }
        }
        return null;
    }
    
    let localStorage = window.localStorage;
    let now = new Date();
    let exp;
    let exp2 = new Date(security.expire);
    
    if ((!getCookie('eventualUser')) || (!localStorage.getItem('eventualUser'))) {
        clearCookiesAndStorage();
        localStorage.setItem('userLoggedIn', false);
        return false;
    }
    
    if ((getCookie(security.key) === null) || (localStorage.getItem(security.key) === null)) {
        clearCookiesAndStorage();
        localStorage.setItem('userLoggedIn', false);
        return false;
    }
    if ((getCookie(security.key) !== security.value) || (localStorage.getItem(security.key) !== security.value)) {
        clearCookiesAndStorage();
        localStorage.setItem('userLoggedIn', false);
        return false;
    }
    if ((getCookie('eventualRelease') === null) || (localStorage.getItem('eventualRelease') === null)) {
        clearCookiesAndStorage();
        localStorage.setItem('userLoggedIn', false);
        return false;
    }
    exp = new Date(localStorage.getItem('eventualRelease'));
    if (now.getTime() > exp.getTime()) {
        clearCookiesAndStorage();
        localStorage.setItem('userLoggedIn', false);
        return false;
    }
    if (now.getTime() > exp2.getTime()) {
        clearCookiesAndStorage();
        localStorage.setItem('userLoggedIn', false);
        return false;
    }
    
    
    return true;
}

export default CheckStatus;