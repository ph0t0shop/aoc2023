export async function run(lines: string[]) {
    const letterToNumberMap1 = {
        'A': 14,
        'K': 13,
        'Q': 12,
        'J': 11,
        'T': 10,
        '9': 9,
        '8': 8,
        '7': 7,
        '6': 6,
        '5': 5,
        '4': 4,
        '3': 3,
        '2': 2
    };

    const letterToNumberMap2 = {
        'A': 14,
        'K': 13,
        'Q': 12,
        'T': 10,
        '9': 9,
        '8': 8,
        '7': 7,
        '6': 6,
        '5': 5,
        '4': 4,
        '3': 3,
        '2': 2,
        'J': 1,
    };

    enum HandType {
        FIVE_OF_A_KIND,
        FOUR_OF_A_KIND,
        FULL_HOUSE,
        THREE_OF_A_KIND,
        TWO_PAIR,
        ONE_PAIR,
        HIGH_CARD
    }

    type FiveNumbers = [number, number, number, number, number]

    type Hand = {
        type: HandType,
        cards: FiveNumbers,
        bid: number
    };

    function calcHandType(cards: FiveNumbers): HandType {
        const seenSet: Set<number> = new Set();
        const numSeen: Record<number, number> = {};

        for (let i = 0; i < 5; i++) {
            const card = cards[i];
            seenSet.add(card);
            if (card in numSeen) numSeen[card]++;
            else numSeen[card] = 1;
        }

        const numJokers = numSeen[1] ?? 0;

        if (seenSet.size === 1 || (seenSet.size === 2 && numJokers > 0)) return HandType.FIVE_OF_A_KIND;
        if (seenSet.size === 2) { // 1,4 | 2,3
            for (const entry of seenSet.keys()) {
                if (numSeen[entry] === 1 || numSeen[entry] === 4) {
                    return HandType.FOUR_OF_A_KIND;
                }
                return HandType.FULL_HOUSE;
            }
        }
        if (seenSet.size === 3) { // 1,1,3 | 1,2,2
            for (const val of Object.values(numSeen)) {
                if (val === 3) {
                    if (numJokers > 0) {
                        return HandType.FOUR_OF_A_KIND;
                    }
                    return HandType.THREE_OF_A_KIND;
                } else if (val === 2) {
                    if (numJokers === 1) {
                        return HandType.FULL_HOUSE;
                    } else if (numJokers === 2) {
                        return HandType.FOUR_OF_A_KIND;
                    }
                    return HandType.TWO_PAIR;
                }
            }
        }
        if (seenSet.size === 4) { // 1,1,1,2
            if (numJokers > 0) {
                return HandType.THREE_OF_A_KIND;
            }
            return HandType.ONE_PAIR;
        }
        if (numJokers > 0) {
            return HandType.ONE_PAIR;
        }
        return HandType.HIGH_CARD;
    }

    const hands1: Hand[] = [];
    const hands2: Hand[] = [];

    for (const line of lines) {
        const [cardStr, bidStr] = line.split(" ");
        const cards1 = cardStr.split("").map(char => letterToNumberMap1[char as 'A']) as FiveNumbers;
        hands1.push({
            cards: cards1,
            bid: parseInt(bidStr),
            type: calcHandType(cards1)
        });

        const cards2 = cardStr.split("").map(char => letterToNumberMap2[char as 'A']) as FiveNumbers;
        hands2.push({
            cards: cards2,
            bid: parseInt(bidStr),
            type: calcHandType(cards2)
        });
    }

    function calcWinnings(hands: Hand[]) {
        hands.sort((hand1, hand2) => { // sort in ascending order, weakest hand first!
            // subtraction, first one is lesser one for ascending
            if (hand1.type !== hand2.type) {
                return hand2.type - hand1.type;
            }
    
            for (let i = 0; i < 5; i++) {
                const card1 = hand1.cards[i];
                const card2 = hand2.cards[i];
                if (card1 !== card2) {
                    return card1 - card2;
                }
            }
    
            return 0;
        });
    
        console.log(hands.reduce((acc, hand, index) => {
            return acc + hand.bid * (index + 1);
        }, 0))
    }

    calcWinnings(hands1);
    calcWinnings(hands2);
}