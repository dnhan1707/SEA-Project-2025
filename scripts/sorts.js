
function compareString(str_a, str_b) {
    str_a = str_a.toLowerCase();
    str_b = str_b.toLowerCase();

    const len = Math.min(str_a.length, str_b.length);

    for(let i = 0; i < len; i++) {
        const charCode_a = str_a.charCodeAt(i);
        const charCode_b = str_b.charCodeAt(i)

        if(charCode_a > charCode_b) {
            return 1;
        }
        if(charCode_b > charCode_a) {
            return -1;
        }
    }

    return str_a.length - str_b.length
}

export function sortAtoZ(champions){
    console.log("Soring A to Z")
    for(let i = 0; i < champions.length; i++) {
        for(let j = i + 1; j < champions.length; j++) {
            if(compareString(champions[i].champName, champions[j].champName) > 0) {
                // Since this is A->Z so we want the smaller str to come up
                const tmp = champions[i];
                champions[i] = champions[j];
                champions[j] = tmp;
            }
        }
    }

    return champions
}

export function sortZtoA(champions){
    console.log("Soring Z to A")

    for(let i = 0; i < champions.length; i++) {
        for(let j = i + 1; j < champions.length; j++) {
            if(compareString(champions[i].champName, champions[j].champName) < 0) {
                // Since this is Z->A so we want the larger str to come up
                const tmp = champions[i];
                champions[i] = champions[j];
                champions[j] = tmp;
            }
        }
    }

    return champions
}


export function sortEasyToHard(champions) {
    const difficultyMap = {
        'Hard': 3,
        'Moderate': 2,
        'Easy': 1
    }

    // Selection sort
    for(let j = 0; j < champions.length; j++) {
        for(let k = j + 1; k < champions.length; k++) {
            if(difficultyMap[champions[j].difficulty] > difficultyMap[champions[k].difficulty]) {
                const tmp = champions[j];
                champions[j] = champions[k]
                champions[k] = tmp
            }
        }
    }
    return champions;
}


export function sortHardToEasy(champions) {
    const difficultyMap = {
        'Hard': 3,
        'Moderate': 2,
        'Easy': 1
    }

    // Selection sort
    for(let j = 0; j < champions.length; j++) {
        for(let k = j + 1; k < champions.length; k++) {
            if(difficultyMap[champions[j].difficulty] < difficultyMap[champions[k].difficulty]) {
                const tmp = champions[j];
                champions[j] = champions[k]
                champions[k] = tmp
            }
        }
    }
    return champions;
}

