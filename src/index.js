import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';

function isDog(card) {
    return card instanceof Dog;
}

function isDuck(card) {
    return card instanceof Duck;
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

class Duck extends Card {
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

class Dog extends Card {
    constructor() {
        super('Пес-бандит', 3);
    }
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


const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
];

const banditStartDeck = [
    new Dog(),
];


// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});
