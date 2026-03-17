import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';


class Creature extends Card {
    constructor(name, maxPower, image) {
        super(name, maxPower, image);
    }

    getDescriptions(){
        return [
            getCreatureDescription(this),
            super.getDescriptions()
        ];
    };
}


class Duck extends Creature {
    constructor() {
        super('Мирная утка', 2);
    }

    quacks() {
        console.log('quack');
    }

    swims() {
        console.log('float: both;');
    }
}

class Dog extends Creature {
    constructor() {
        super('Пес-бандит', 3);
    }
}


function isDuck(card) {
    return card instanceof Duck;
}

function isDog(card) {
    return card instanceof Dog;
}


class Trasher extends Dog {
    constructor() {
        super();
        this.name = 'Громила';
        this.maxPower = 5;
        this.currentPower = 5;
        this.updateView();
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        this.view.signalAbility(() => {
            continuation(value - 1);
        });
    }

    getDescriptions() {
        return [
            'Получает на 1 меньше урона',
            ...super.getDescriptions(),
        ];
    }
}



class Gatling extends Creature {
    constructor() {
        super();
        this.name = 'Gatling';
        this.maxPower = 6;
        this.currentPower = 6;
        this.updateView();
    }

    attack(gameContext, continuation) {
            const taskQueue = new TaskQueue();
    
            const {currentPlayer, oppositePlayer, position, updateView} = gameContext;
            const oppositePlayerCards = gameContext.oppositePlayer.table;
            
            for (const oppositeCard of oppositePlayerCards)  {
                taskQueue.push(onDone => this.view.showAttack(onDone));
                taskQueue.push(onDone => {
                    if (oppositeCard) {
                        this.dealDamageToCreature(2, oppositeCard, gameContext, onDone);
                    } 
                });
            }
    
            taskQueue.continueWith(continuation);
        };
    

    getDescriptions() {
        return [
            'Наносит всем картам противника 2 урона.',
            ...super.getDescriptions(),
        ];
    }
}


// Дает описание существа по схожести с утками и собаками
function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    return 'Существо';
}


const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
    new Gatling(),
];
const banditStartDeck = [
    new Trasher(),
    new Dog(),
    new Dog(),
];



// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(4);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});


