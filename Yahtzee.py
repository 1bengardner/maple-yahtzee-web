from js import yobject
import random

def gameOver():
    yobject.rollButton.setState("disabled")
    yobject.gameOver(totalScore, yahtzeeCount, subTotalBonus)

def diceReset():
    global rollCount
    global potentialScore
    global die1value
    global die2value
    global die3value
    global die4value
    global die5value
    potentialScore = 0
    rollCount = 0
    yobject.die1.setImage(yobject.photoList[20])
    yobject.die2.setImage(yobject.photoList[20])
    yobject.die3.setImage(yobject.photoList[20])
    yobject.die4.setImage(yobject.photoList[20])
    yobject.die5.setImage(yobject.photoList[20])
    die1value=0
    die2value=0
    die3value=0
    die4value=0
    die5value=0
    yobject.dieHold1.deselect()
    yobject.dieHold2.deselect()
    yobject.dieHold3.deselect()
    yobject.dieHold4.deselect()
    yobject.dieHold5.deselect()
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    yobject.selectButton.setState("disabled")
    yobject.rollButton.setState("normal")
    yobject.rollCountLabel.setText("Rolls Made: "+str(rollCount))

def select():
    global totalScore
    global selectionCount
    global subTotal
    global yahtzeeCount
    global subTotalBonus
    global usedYahtzee
    if rollUsed != 0:
        if rollUsed == 1:
            yobject.onesButton.setState("disabled")
            subTotal += potentialScore
        elif rollUsed == 2:
            yobject.twosButton.setState("disabled")
            subTotal += potentialScore
        elif rollUsed == 3:
            yobject.threesButton.setState("disabled")
            subTotal += potentialScore
        elif rollUsed == 4:
            yobject.foursButton.setState("disabled")
            subTotal += potentialScore
        elif rollUsed == 5:
            yobject.fivesButton.setState("disabled")
            subTotal += potentialScore
        elif rollUsed == 6:
            yobject.sixesButton.setState("disabled")
            subTotal += potentialScore
        elif rollUsed == 7:
            yobject.threeOfAKindButton.setState("disabled")
        elif rollUsed == 8:
            yobject.fourOfAKindButton.setState("disabled")
        elif rollUsed == 9:
            yobject.fullHouseButton.setState("disabled")
        elif rollUsed == 10:
            yobject.smallStraightButton.setState("disabled")
        elif rollUsed == 11:
            yobject.largeStraightButton.setState("disabled")
        elif rollUsed == 12:
            yobject.chanceButton.setState("disabled")
        elif rollUsed == 13:
            yobject.yahtzeeButton.setState("disabled")
            usedYahtzee = True
        selectionCount += 1
        totalScore += potentialScore
        if bonusYahtzee:
            totalScore += 100
            yahtzeeCount += 1
        if subTotal >= 63 and subTotalBonus == False:
            totalScore += 35
            subTotalBonus = True
            yobject.subTotalLabel.flash();
        yobject.yahtzeeCountLabel.setText("Yahtzees: "+str(yahtzeeCount))
        yobject.subTotalLabel.setText("Sub Total: "+str(subTotal))
        yobject.scoreLabel.setText("SCORE "+str(totalScore))
        
        diceReset()
        if selectionCount == 13:
            gameOver()
    else:
        pass


def ones():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if die1value == 1:
        potentialScore += 1
    if die2value == 1:
        potentialScore += 1
    if die3value == 1:
        potentialScore += 1
    if die4value == 1:
        potentialScore += 1
    if die5value == 1:
        potentialScore += 1
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 1

def twos():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if die1value == 2:
        potentialScore += 2
    if die2value == 2:
        potentialScore += 2
    if die3value == 2:
        potentialScore += 2
    if die4value == 2:
        potentialScore += 2
    if die5value == 2:
        potentialScore += 2
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 2

def threes():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if die1value == 3:
        potentialScore += 3
    if die2value == 3:
        potentialScore += 3
    if die3value == 3:
        potentialScore += 3
    if die4value == 3:
        potentialScore += 3
    if die5value == 3:
        potentialScore += 3
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 3

def fours():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if die1value == 4:
        potentialScore += 4
    if die2value == 4:
        potentialScore += 4
    if die3value == 4:
        potentialScore += 4
    if die4value == 4:
        potentialScore += 4
    if die5value == 4:
        potentialScore += 4
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 4

def fives():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if die1value == 5:
        potentialScore += 5
    if die2value == 5:
        potentialScore += 5
    if die3value == 5:
        potentialScore += 5
    if die4value == 5:
        potentialScore += 5
    if die5value == 5:
        potentialScore += 5
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 5

def sixes():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if die1value == 6:
        potentialScore += 6
    if die2value == 6:
        potentialScore += 6
    if die3value == 6:
        potentialScore += 6
    if die4value == 6:
        potentialScore += 6
    if die5value == 6:
        potentialScore += 6
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 6

def threeOfAKind():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if (die1value == die2value == die3value)\
or (die1value == die2value == die4value)\
or (die1value == die2value == die5value)\
or (die1value == die3value == die4value)\
or (die1value == die3value == die5value)\
or (die1value == die4value == die5value)\
or (die2value == die3value == die4value)\
or (die2value == die3value == die5value)\
or (die2value == die4value == die5value)\
or (die3value == die4value == die5value):
        potentialScore = die1value + die2value + die3value + die4value + die5value
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 7

def fourOfAKind():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if (die1value == die2value == die3value == die4value)\
or (die1value == die2value == die3value == die5value)\
or (die1value == die2value == die4value == die5value)\
or (die1value == die3value == die4value == die5value)\
or (die2value == die3value == die4value == die5value):
        potentialScore = die1value + die2value + die3value + die4value + die5value
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 8

def fullHouse():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if (((die1value == die2value) and (die3value == die4value == die5value))\
or ((die1value == die3value) and (die2value == die4value == die5value))\
or ((die1value == die4value) and (die2value == die3value == die5value))\
or ((die1value == die5value) and (die2value == die4value == die3value))\
or ((die2value == die3value) and (die1value == die4value == die5value))\
or ((die2value == die4value) and (die1value == die3value == die5value))\
or ((die2value == die5value) and (die1value == die4value == die3value))\
or ((die3value == die4value) and (die1value == die2value == die5value))\
or ((die3value == die5value) and (die1value == die2value == die4value))\
or ((die4value == die5value) and (die1value == die2value == die3value)))\
and ((die1value == die2value == die3value == die4value == die5value) == False):
        potentialScore = 25
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 9

def smallStraight():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if (((die1value == 1) or (die2value == 1) or (die3value == 1) or (die4value == 1) or (die5value == 1))\
and ((die1value == 2) or (die2value == 2) or (die3value == 2) or (die4value == 2) or (die5value == 2))\
and ((die1value == 3) or (die2value == 3) or (die3value == 3) or (die4value == 3) or (die5value == 3))\
and ((die1value == 4) or (die2value == 4) or (die3value == 4) or (die4value == 4) or (die5value == 4)))\
or (((die1value == 2) or (die2value == 2) or (die3value == 2) or (die4value == 2) or (die5value == 2))\
and ((die1value == 3) or (die2value == 3) or (die3value == 3) or (die4value == 3) or (die5value == 3))\
and ((die1value == 4) or (die2value == 4) or (die3value == 4) or (die4value == 4) or (die5value == 4))\
and ((die1value == 5) or (die2value == 5) or (die3value == 5) or (die4value == 5) or (die5value == 5)))\
or (((die1value == 3) or (die2value == 3) or (die3value == 3) or (die4value == 3) or (die5value == 3))\
and ((die1value == 4) or (die2value == 4) or (die3value == 4) or (die4value == 4) or (die5value == 4))\
and ((die1value == 5) or (die2value == 5) or (die3value == 5) or (die4value == 5) or (die5value == 5))\
and ((die1value == 6) or (die2value == 6) or (die3value == 6) or (die4value == 6) or (die5value == 6))):
        potentialScore = 30
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 10

def largeStraight():
    global rollUsed
    global potentialScore
    potentialScore = 0
    if (((die1value == 1) or (die2value == 1) or (die3value == 1) or (die4value == 1) or (die5value == 1))\
and ((die1value == 2) or (die2value == 2) or (die3value == 2) or (die4value == 2) or (die5value == 2))\
and ((die1value == 3) or (die2value == 3) or (die3value == 3) or (die4value == 3) or (die5value == 3))\
and ((die1value == 4) or (die2value == 4) or (die3value == 4) or (die4value == 4) or (die5value == 4))\
and ((die1value == 5) or (die2value == 5) or (die3value == 5) or (die4value == 5) or (die5value == 5)))\
or (((die1value == 2) or (die2value == 2) or (die3value == 2) or (die4value == 2) or (die5value == 2))\
and ((die1value == 3) or (die2value == 3) or (die3value == 3) or (die4value == 3) or (die5value == 3))\
and ((die1value == 4) or (die2value == 4) or (die3value == 4) or (die4value == 4) or (die5value == 4))\
and ((die1value == 5) or (die2value == 5) or (die3value == 5) or (die4value == 5) or (die5value == 5))\
and ((die1value == 6) or (die2value == 6) or (die3value == 6) or (die4value == 6) or (die5value == 6))):
        potentialScore = 40
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 11

def chance():
    global rollUsed
    global potentialScore
    potentialScore = die1value + die2value + die3value + die4value + die5value
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 12

def yahtzee():
    global rollUsed
    global potentialScore
    global yahtzeeCount
    potentialScore = 0
    if die1value == die2value == die3value == die4value == die5value and die1value != 0:
        potentialScore = 50
        yahtzeeCount += 1
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    rollUsed = 13

def roll():
    global rollCount
    global rollUsed
    global bonusYahtzee
    global die1value
    global die2value
    global die3value
    global die4value
    global die5value
    potentialScore = 0
    rollUsed = 0
    bonusYahtzee = False
    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    yobject.selectButton.setState("normal")
    if yobject.dieHold1.checked == False or die1value == 0:
        number = random.randrange(1,7)
        yobject.die1.setImage(yobject.photoList[number-1])
        die1value=number
    if yobject.dieHold2.checked == False or die2value == 0:
        number = random.randrange(1,7)
        yobject.die2.setImage(yobject.photoList[number-1])
        die2value=number
    if yobject.dieHold3.checked == False or die3value == 0:
        number = random.randrange(1,7)
        yobject.die3.setImage(yobject.photoList[number-1])
        die3value=number
    if yobject.dieHold4.checked == False or die4value == 0:
        number = random.randrange(1,7)
        yobject.die4.setImage(yobject.photoList[number-1])
        die4value=number
    if yobject.dieHold5.checked == False or die5value == 0:
        number = random.randrange(1,7)
        yobject.die5.setImage(yobject.photoList[number-1])
        die5value=number
    if die1value == die2value == die3value == die4value == die5value:
        if yahtzeeCount == 0:
            if not usedYahtzee:
                yobject.yahtzeeButton.flash()
        else:
            bonusYahtzee = True
    rollCount += 1
    yobject.rollCountLabel.setText("Rolls Made: "+str(rollCount))
    rollDisable()

def rollDisable():
    if rollCount == 3:
        yobject.rollButton.setState("disabled")

def resetGame():
    global rollCount
    global potentialScore
    global totalScore
    global selectionCount
    global yahtzeeCount
    global subTotal
    global bonusYahtzee
    global subTotalBonus
    global usedYahtzee
    rollCount=0
    potentialScore=0
    totalScore=0
    selectionCount=0
    subTotal=0
    bonusYahtzee=False
    subTotalBonus=False
    yahtzeeCount=0
    usedYahtzee=False

    yobject.rollButton.setState("normal")
    yobject.onesButton.setState("normal")
    yobject.twosButton.setState("normal")
    yobject.threesButton.setState("normal")
    yobject.foursButton.setState("normal")
    yobject.fivesButton.setState("normal")
    yobject.sixesButton.setState("normal")
    yobject.threeOfAKindButton.setState("normal")
    yobject.fourOfAKindButton.setState("normal")
    yobject.fullHouseButton.setState("normal")
    yobject.smallStraightButton.setState("normal")
    yobject.largeStraightButton.setState("normal")
    yobject.chanceButton.setState("normal")
    yobject.yahtzeeButton.setState("normal")

    yobject.rollScore.setText("Roll Value: "+str(potentialScore))
    yobject.scoreLabel.setText("SCORE "+str(totalScore))
    yobject.yahtzeeCountLabel.setText("Yahtzees: "+str(yahtzeeCount))
    yobject.subTotalLabel.setText("Sub Total: "+str(subTotal), fg="black")
    
    diceReset()

#main
rollCount = 0
potentialScore = 0
totalScore = 0
selectionCount = 0
subTotal = 0
yahtzeeCount = 0
bonusYahtzee = False
subTotalBonus = False

#new
die1value = 0
die2value = 0
die3value = 0
die4value = 0
die5value = 0
usedYahtzee = False

diceReset()
