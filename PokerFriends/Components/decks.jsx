
const SUITS = ['♣','♦','♥','♠']
const VALUE = ['2','3','4','5','6','7','8','9','10','A','J','K','Q']
const CARDIMG = []

class deck {
    constructor (cards) {
        this.cards = cards
    }
}

class cards {
    constructor(suit, value, image ){
        this.suit = suit
        this.value = value
        this.image = image
    }
}


function freshDeck() {

    for (i = 1; i <= 52; i ++)
    {
        CARDIMG[i] = new Image();
        CARDIMG[i].src = '';
    }

    return SUITS.map(suit => {
        return VALUE.map(value => {
            return CARDIMG.map(img => {
                return new cards(suit, value, img)
            })
        })
    }
        )
}