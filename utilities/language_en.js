Spielebuch.i18n.en = {
    countdownStarted: 'A countdown started.',
    countdownEnded: 'Countdown stopped.',
    countdownTime: function(timeLeft){
        return `${timeLeft} seconds left...`;
    },
    destroyedObject: function(name){
        return `${name} destroyed.`;
    },
    destroyedPlayer: function(name){
        return `${name} was killed.`;
    },
    damage: function(attacker,target, damage){
        return `${attacker} attacked ${target} and inflicted ${damage} ${Spielebuch.Gameplay.damage}`
    },
    event: function(player, event, target){
        return `${player} used ${event} on ${target}.`;
    }


}