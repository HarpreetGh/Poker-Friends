
const SUITS = ['♣','♦','♥','♠']
const VALUE = ['2','3','4','5','6','7','8','9','10','A','J','K','Q']
const CARDIMG = []

export default class Deck {
    constructor (cards = freshDeck()) { 
        this.cards = cards
   
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

   
   
        return SUITS.flatMap(suit => {
            return VALUE.map(value => {
                return CARDIMG.forEach(image => {
                     return new Cards(suit, value, image)
                })
                 
            })
            
        })
        
        
}