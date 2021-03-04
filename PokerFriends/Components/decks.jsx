
const SUITS = ['♣','♦','♥','♠']
const VALUE = ['2','3','4','5','6','7','8','9','10','A','J','K','Q']
const CARDIMG = []

export default class Deck {
    constructor (cards = freshDeck()) { 
        for(var i = 0; i < 52; i++)
        {
            cards[i].image = CARDIMG[i]
        }
        this.cards = cards
    }

    get numberOfCards() {
       return this.cards.length
    }

    shuffle(){
        for(let i = this.numberOfCards -1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i+1))
            const oldIndex = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldIndex
        }

    }

}

 class Cards {
    constructor(suit, value, image ){
        this.suit = suit
        this.value = value
        this.image = image
    }
}


function freshDeck() {
    var i;
     for (i = 0; i < 52; i ++)
     {
        //CARDIMG[i] = new Image();
        CARDIMG[i] = '../assets/deckOfCards/PNG/' + (i+1) + '.png';
     }

        return VALUE.flatMap(suit => {
            return SUITS.map(value => {
                return new Cards(suit, value)
            });
            
        });
        
        
}

