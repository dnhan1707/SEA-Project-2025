import { champions } from "./data.js";


export function tagFilter(checkedTag) {
    if (checkedTag.length == 0) {
        return champions
    }

    let filteredCards = []
    for(let i = 0; i < champions.length; i++) {
        const champion = champions[i]
        let count = 0;
        checkedTag.forEach(tag => {
            if(champion.tag.includes(tag)) {
                count += 1;
                if(count == checkedTag.length){
                    filteredCards.push(champion);
                }
            }
        });
    }
    return filteredCards;
}