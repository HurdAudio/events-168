function EncryptPassword(password, security) {
    
    function encryptBySalt(word, salt) {
            let insertionPoint = Math.floor(Math.random() * word.length);
            let result = '';
            if (insertionPoint === 0) {
                result = salt + word;
            } else {
                result = word.slice(0, insertionPoint) + salt + word.slice(insertionPoint);
            }

            return (result);
        }

    function encryptByKey(word, key) {
        let asciiLimit = 65535;
        let index = 0;
        let result = '';
        let insertChar = 0;
        let keyChar = 0;
        let wordChar = 0;

        for (let i = 0; i < word.length; i++) {
            keyChar = key.charCodeAt(index);
            wordChar = word.charCodeAt(i);
            insertChar = wordChar + keyChar;
            if (insertChar > asciiLimit) {
                insertChar = insertChar - asciiLimit;
            }
            result += String.fromCharCode(insertChar);
            ++index;
            if (index === key.length) {
                index = 0;
            }
        }

        return (result);
    }

    function encryptByInversion(word, invert) {
        let asciiLimit = 65535;
        let result = '';
        let indexChar = 0;
        let insertChar = 0;

        for (let i = 0; i < word.length; i++) {
            indexChar = word.charCodeAt(i);
            insertChar = invert + (invert - indexChar);
            if (insertChar < 0) {
                insertChar += asciiLimit;
            }
            insertChar = insertChar % asciiLimit;
            result += String.fromCharCode(insertChar);
        }

        return (result);
    }

    function shuffleArray(arr) {

        for (let multi = 0; multi < 128; multi++) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        return (arr);
    }

        function ecryptionArray(password, encrypt) {

            let passwords = [];
            passwords[0] = encryptByInversion(password, encrypt.inversion.charCodeAt(0));
            passwords[1] = encryptByKey(password, encrypt.onetime_key);
            passwords[2] = encryptBySalt(password, encrypt.salt);
            passwords[3] = password.split('').reverse().join('');
            passwords[4] = passwords[0];
            passwords[5] = passwords[1];
            passwords[6] = passwords[2];
            passwords[7] = passwords[3];
            passwords[8] = passwords[0];
            passwords[9] = passwords[1];
            passwords[10] = passwords[2];
            passwords[11] = passwords[3];
            passwords[0] = encryptBySalt(passwords[0], encrypt.salt);
            passwords[1] = passwords[1].split('').reverse().join('');
            passwords[2] = encryptByInversion(passwords[2], encrypt.inversion.charCodeAt(0));
            passwords[3] = encryptByKey(passwords[3], encrypt.onetime_key);
            passwords[4] = passwords[4].split('').reverse().join('');
            passwords[5] = encryptByInversion(passwords[5],
                encrypt.inversion.charCodeAt(0));
            passwords[6] = encryptByKey(passwords[6], encrypt.onetime_key);
            passwords[7] = encryptBySalt(passwords[7], encrypt.salt);
            passwords[8] = passwords[8].split('').reverse().join('');
            passwords[9] = encryptBySalt(passwords[9], encrypt.salt);
            passwords[10] = passwords[10].split('').reverse().join('');
            passwords[11] = encryptByInversion(passwords[11], encrypt.inversion.charCodeAt(0));
            passwords[0] = passwords[0].split('').reverse().join('');
            passwords[1] = encryptByInversion(passwords[1], encrypt.inversion.charCodeAt(0));
            passwords[2] = encryptByKey(passwords[2], encrypt.onetime_key);
            passwords[3] = encryptBySalt(passwords[3], encrypt.salt);
            passwords[4] = encryptBySalt(passwords[4], encrypt.salt);
            passwords[5] = encryptBySalt(passwords[5], encrypt.salt);
            passwords[6] = encryptByInversion(passwords[6], encrypt.inversion.charCodeAt(0));
            passwords[7] = encryptByKey(passwords[7], encrypt.onetime_key);
            passwords[8] = encryptBySalt(passwords[8], encrypt.salt);
            passwords[9] = encryptByInversion(passwords[9], encrypt.inversion.charCodeAt(0));
            passwords[10] = encryptByKey(passwords[10], encrypt.onetime_key);
            passwords[11] = encryptBySalt(passwords[11], encrypt.salt);
            passwords[0] = encryptByKey(passwords[0], encrypt.onetime_key);
            passwords[1] = encryptBySalt(passwords[1], encrypt.salt);
            passwords[2] = passwords[2].split('').reverse().join('');
            passwords[3] = passwords[3].split('').reverse().join('');
            passwords[4] = encryptByKey(passwords[4], encrypt.onetime_key);
            passwords[5] = passwords[5].split('').reverse().join('');
            passwords[6] = passwords[6].split('').reverse().join('');
            passwords[7] = encryptByInversion(passwords[7], encrypt.inversion.charCodeAt(0));
            passwords[8] = encryptByKey(passwords[8], encrypt.onetime_key);
            passwords[9] = passwords[9].split('').reverse().join('');
            passwords[10] = encryptByInversion(passwords[10], encrypt.inversion.charCodeAt(0));
            passwords[11] = encryptByKey(passwords[11], encrypt.onetime_key);

            passwords = shuffleArray(passwords);

            return (passwords);
        }
    
    let arr = ecryptionArray(password, security);
    
    return arr;
}

export default EncryptPassword;