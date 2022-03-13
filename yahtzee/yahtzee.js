//main function
$(function () {
    var yahtzeeGame = new YahtzeeGame([0,0,0,0,0]);
    yahtzeeGame.rollDice();
    yahtzeeGame.calculateScores();
    yahtzeeGame.restartGame();

})

//yahtzee class
function YahtzeeGame(initialDiceRoll) {
    //preload images
    preload();
    
    //private variables for dice roll
    var diceRoll = initialDiceRoll;
    //private variables for rolls remaining
    var rollsRemaining = 3;

    //public function for rolling the dice
    this.rollDice = function (){

        $("#roll-dice-button").on("click", (function() {
            if (rollsRemaining === 0) {
                $('span[id^="dice"]').addClass("shake-dice");
                setTimeout(function() { alert("please submit score"); $('span[id^="dice"]').removeClass("shake-dice");}, 600);
                
            }
            //first roll
            else if (rollsRemaining === 3){
                $('input[id^="input-dice"]').prop("checked", false);
                console.log(diceRoll);
                diceRoll.forEach(randomNumber)
                updateDices(diceRoll);
                rollsRemaining -= 1;
                $('#number-of-rolls').text("2 rolls remaining");
                yahtzeeBonus(diceRoll);
            }
            //check for unchecked die and reroll them
            else if (rollsRemaining <= 2 && rollsRemaining > 0)  {
                rollUncheckedDice('#input-dice1','#dice1',0);
                rollUncheckedDice('#input-dice2','#dice2',1);
                rollUncheckedDice('#input-dice3','#dice3',2);
                rollUncheckedDice('#input-dice4','#dice4',3);
                rollUncheckedDice('#input-dice5','#dice5',4);
                rollsRemaining -= 1;
                yahtzeeBonus(diceRoll);

                if (rollsRemaining === 1) {
                    $('#number-of-rolls').text("1 roll remaining");
                }
                if (rollsRemaining === 0) {
                    $('#number-of-rolls').text("please submit score");
                }
            }
        }));

        //check for bonus yahtzee
        function yahtzeeBonus(item) {
            if ($('#points-for-yahtzee').text() === "50" && $('#points-for-yahtzee-bonus').text() === "0") {
                if (item.every(function (x) { return x === item[0] })){
                    $('#points-for-yahtzee-bonus').text(100);
                    var lowertotal = parseInt($('#total-for-lower-table').text()) + parseInt($('#points-for-yahtzee-bonus').text())
                    $('#total-for-lower-table').text(lowertotal); 
                    $('#total-score').text(parseInt($('#total-score').text()) + lowertotal);
                    rollsRemaining = 3;
                    $('#number-of-rolls').text("3 rolls remaining");
                    //for animating dice changing back to blank dice
                    $('span[id^="dice"]').animate({opacity: 1}, 1000, function(){
                        $(this).css({"background-image": "url(\"images/0.png\")"}).animate({opacity:1},{duration:1000})
                    });
                }
            }
        }

        //check for unchecked die and reroll them
        function rollUncheckedDice(checkmark, span, dice) {

            if (!$(checkmark).is(":checked")) {
                diceRoll[dice] = Math.floor(Math.random() * 6) + 1;
                var numberOfPictures = 6;
                var waitPeriod = 200;
                //animate die when rolled then set it to rolled die
                for (var i = numberOfPictures - 1; i >= 0; i--) {
                    setTimeout(changeImage(i, span), i * waitPeriod);
                }
                setTimeout(function () {
                    $(span).css("background-image", "url(\"images/" + diceRoll[dice] + ".png\")");
                }, numberOfPictures * waitPeriod);
            }
        }
        
        //for animating die when rolled
        function changeImage(index, id) {
            return function() {
                var currentImage = 'images/'+(index+1)+'.png';
                $(id).css('background-image','url('+currentImage+')');
            }
        }

        //for first roll
        function updateDices(item) {
            var numberOfPictures = 6;
            var waitPeriod = 200;
            //animate dice when rolled then set it to rolled dice
            for (var i = numberOfPictures - 1; i >= 0; i--) {
                setTimeout(changeImage(i, 'span[id^="dice"]'), i * waitPeriod); }
            setTimeout(function() {
                $('#dice1').css("background-image", "url(\"images/" + item[0] + ".png\")");
                $('#dice2').css("background-image", "url(\"images/" + item[1] + ".png\")");
                $('#dice3').css("background-image", "url(\"images/" + item[2] + ".png\")");
                $('#dice4').css("background-image", "url(\"images/" + item[3] + ".png\")");
                $('#dice5').css("background-image", "url(\"images/" + item[4] + ".png\")");
            }, numberOfPictures * waitPeriod);
        }

        //generate an array with random numbers between 1 and 6
        function randomNumber(item, index, array) {
            array[index] = Math.floor(Math.random() * 6) + 1;
        }
        
    }

    //pubic function for calculating scores
    this.calculateScores = function () {
        calculateTable1();
        calculateTable2();

        //function for calculate table 1
        function calculateTable1() {
            table1SubmitClickButton('#aces-submit-button', 1, '#points-for-1');
            table1SubmitClickButton('#twos-submit-button', 2, '#points-for-2');
            table1SubmitClickButton('#threes-submit-button', 3, '#points-for-3');
            table1SubmitClickButton('#fours-submit-button', 4, '#points-for-4');
            table1SubmitClickButton('#fives-submit-button', 5, '#points-for-5');
            table1SubmitClickButton('#sixes-submit-button', 6, '#points-for-6');

            function table1SubmitClickButton(button, value, points) {
                $(button).on('click', function () {
                    console.log(diceRoll)
                    checkDiceFor(value, points, diceRoll);
                    $(this).prop('disabled', true);
                    resetRolls();
                    calculateTotalsForTable1();
                    totalScore();
                })
            }

            function calculateTotalsForTable1() {
                calculateBonus();
                $('#points-for-subtotal').text(parseInt(subtotal()));
                var total = parseInt(subtotal()) + parseInt($('#points-for-bonus').text());
                $('#total-for-upper-table').text(total)
            }

            function calculateBonus() {
                var bonus = subtotal();
                if (bonus >= 63) {
                    $('#points-for-bonus').text("35");
                }
                totalScore()
            }

            function subtotal() {
                return parseInt($('#points-for-1').text()) +
                    parseInt($('#points-for-2').text()) +
                    parseInt($('#points-for-3').text()) +
                    parseInt($('#points-for-4').text()) +
                    parseInt($('#points-for-5').text()) +
                    parseInt($('#points-for-6').text()) +
                    parseInt($('#points-for-bonus').text());
            }

            function checkDiceFor(value, points , item) {
                console.log(item)
                var score = 0;
                for (var dice of item) {
                    if (dice === value) {
                        score += value;
                    }
                }
                $(points).text(score);
            }
        }

        //function for calculate table 2
        function calculateTable2() {

            table2SubmitClickButton('#three-of-a-kind-submit-button', 3, '#points-for-three-of-a-kind');
            table2SubmitClickButton('#four-of-a-kind-submit-button', 4, '#points-for-four-of-a-kind');
            table2SubmitClickButton('#full-house-submit-button', "fullHouse", '#points-for-full-house');
            table2SubmitClickButton('#small-straight-submit-button' , "smallStraight", '#points-for-small-straight');
            table2SubmitClickButton('#large-straight-submit-button' , "largeStraight", '#points-for-large-straight');
            table2SubmitClickButton('#yahtzee-submit-button', "yahtzee", '#points-for-yahtzee')
            table2SubmitClickButton('#chance-submit-button', "chance", '#points-for-chance')

            function table2SubmitClickButton(button, value, points) {
                $(button).on('click', function () {
                    switch (value) {
                        case 3:
                        case 4:
                            checkDiceForMinimum(value, points, diceRoll);
                            break;
                        case "fullHouse":
                            checkDiceForFullHouse(5, points, diceRoll);
                            break;
                        case "smallStraight":
                            checkForStraight([[1, 2, 3, 4], [2, 3, 4, 5],[3, 4, 5, 6]], points, diceRoll, 30);
                            break;
                        case "largeStraight":
                            checkForStraight([[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]], points, diceRoll,40);
                            break;
                        case "yahtzee":
                            checkForYahtzee(points, diceRoll);
                            break;
                        case "chance":
                            chance(points, diceRoll);
                            break
                    }

                    $(this).prop('disabled', true);
                    resetRolls();
                    lowerTotal();
                    totalScore();
                })
            }


            function chance(points, item) {
                var  score = 0;
                for (var die of item) {
                    score += die
                }
                $(points).text(score);
            }

            function checkForYahtzee(points, item) {
                if (item.every(function (x) { return x === item[0] }) && item[0] != 0){
                    $(points).text(50);
                }
            }

            function checkForStraight(value,points , item , howToScore) {
                var score = 0;
                for (var i = 0; i < value.length; i++) {
                    if (value[i].every(function (val) { return item.indexOf(val) >= 0;}) && parseInt(item[0]) > 0) {
                        score = howToScore;
                        i = value.length + 1;
                    }
                }
                $(points).text(score);
            }

            function checkDiceForFullHouse(value, points , item) {
                var match = 0;
                var total = 0;
                var copy = $.extend(true,[], item);
                if (parseInt(item[0]) > 0) {
                    for (var diceCheck of copy) {
                        for (var dice of copy) {
                            if (diceCheck === dice) {
                                match += 1;
                            }
                        }
                        if (match >= 2) {
                            total += match;
                        }
                        match = 0;
                        copy.remove(diceCheck)
                    }
                if (total === value) {
                    $(points).text(25);
                }
                }
            }

            function checkDiceForMinimum(value, points , item) {
                var score = 0;
                var match = 0;
                var matchedDie = 0;
                for (var diceCheck of item) {
                    match = 0;
                    for (var dice of item) {
                        if (diceCheck === dice) {
                            match += 1;
                        }
                    }
                    if (match >= value) {
                        matchedDie = diceCheck;
                        break;
                    }
                    item.remove(diceCheck)
                }
                if (match >= value) {
                    score = matchedDie * match
                    $(points).text(score.toString());
                }
            }

            Array.prototype.remove = function(x) {
                for( var i = 0; i < this.length; i++){

                    if ( this[i] === x) {
                        this.splice(i, 1);
                        i--;
                    }
                }
            }

            function lowerTotal() {
                var total = parseInt($('#points-for-three-of-a-kind').text()) +
                    parseInt($('#points-for-four-of-a-kind').text()) +
                    parseInt($('#points-for-full-house').text()) +
                    parseInt($('#points-for-small-straight').text()) +
                    parseInt($('#points-for-large-straight').text()) +
                    parseInt($('#points-for-yahtzee').text()) +
                    parseInt($('#points-for-yahtzee-bonus').text());

                $('#total-for-lower-table').text(total);
            }
        }

        //function for resetting rolls
        function resetRolls() {
            rollsRemaining = 3;
            $('#number-of-rolls').text("3 rolls remaining");
            diceRoll = [0,0,0,0,0];
            //for animating dice changing back to blank dice
            $('span[id^="dice"]').animate({opacity: 1}, 500, function(){
                $(this).css({"background-image": "url(\"images/0.png\")"}).animate({opacity:1},{duration:500})
            });

        }

        //function for calculating total score
        function totalScore() {
            var score = parseInt($('#total-for-upper-table').text()) + parseInt($('#total-for-lower-table').text())
            $('#total-score').text(score.toString());
        }

    }

    //public function to restart game
    this.restartGame = function () {
        $('#restart-game').on('click', function () {
            history.go(0)
        })
    }

    //function for preloading images
    function preload() {
        function preloader() {
            if (document.images) {
                var img1 = new Image();
                var img2 = new Image();
                var img3 = new Image();
                var img4 = new Image();
                var img5 = new Image();
                var img6 = new Image();

                img1.src = "images/1.png";
                img2.src = "images/2.png";
                img3.src = "images/3.png";
                img4.src = "images/4.png";
                img5.src = "images/5.png";
                img6.src = "images/6.png";
            }
        }
        function addLoadEvent(func) {
            var oldonload = window.onload;
            if (typeof window.onload != 'function') {
                window.onload = func;
            } else {
                window.onload = function() {
                    if (oldonload) {
                        oldonload();
                    }
                    func();
                }
            }
        }
        addLoadEvent(preloader);
    }

}